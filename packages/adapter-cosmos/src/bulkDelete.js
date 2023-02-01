/**
 * A Cosmos DB stored procedure that bulk deletes documents for a given query.<br/>
 * Note: You may need to execute this sproc multiple times (depending whether the sproc is able to delete every document within the execution timeout limit).
 *
 * @function
 * @param {string} query - A query that provides the documents to be deleted (e.g. "SELECT c._self FROM c WHERE c.founded_year = 2008"). Note: For best performance, reduce the # of properties returned per document in the query to only what's required (e.g. prefer SELECT c._self over SELECT * )
 * @returns {Object.<number, boolean>} Returns an object with the two properties:<br/>
 *   deleted - contains a count of documents deleted<br/>
 *   continuation - a boolean whether you should execute the sproc again (true if there are more documents to delete; false otherwise).
 */
function bulkDeleteSproc(query) {
  var collection = getContext().getCollection();
  var collectionLink = collection.getSelfLink();
  var response = getContext().getResponse();
  var responseBody = {
      deleted: 0,
      continuation: true
  };

  // Validate input.
  if (!query) throw new Error("The query is undefined or null.");

  tryQueryAndDelete();

  // Recursively runs the query w/ support for continuation tokens.
  // Calls tryDelete(documents) as soon as the query returns documents.
  function tryQueryAndDelete(continuation) {
      var requestOptions = {continuation: continuation};

      var isAccepted = collection.queryDocuments(collectionLink, query, requestOptions, function (err, retrievedDocs, responseOptions) {
          if (err) throw err;

          if (retrievedDocs.length > 0) {
              // Begin deleting documents as soon as documents are returned form the query results.
              // tryDelete() resumes querying after deleting; no need to page through continuation tokens.
              //  - this is to prioritize writes over reads given timeout constraints.
              tryDelete(retrievedDocs);
          } else if (responseOptions.continuation) {
              // Else if the query came back empty, but with a continuation token; repeat the query w/ the token.
              tryQueryAndDelete(responseOptions.continuation);
          } else {
              // Else if there are no more documents and no continuation token - we are finished deleting documents.
              responseBody.continuation = false;
              response.setBody(responseBody);
          }
      });

      // If we hit execution bounds - return continuation: true.
      if (!isAccepted) {
          response.setBody(responseBody);
      }
  }

  // Recursively deletes documents passed in as an array argument.
  // Attempts to query for more on empty array.
  function tryDelete(documents) {
      if (documents.length > 0) {
          // Delete the first document in the array.
          var isAccepted = collection.deleteDocument(documents[0]._self, {}, function (err, responseOptions) {
              if (err) throw err;

              responseBody.deleted++;
              documents.shift();
              // Delete the next document in the array.
              tryDelete(documents);
          });

          // If we hit execution bounds - return continuation: true.
          if (!isAccepted) {
              response.setBody(responseBody);
          }
      } else {
          // If the document array is empty, query for more documents.
          tryQueryAndDelete();
      }
  }
}