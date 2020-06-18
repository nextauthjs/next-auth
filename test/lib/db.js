exports.compareSchemas = (expected, actual) => {
  const errors = []

  // Check all models and properties that are expected exist
  for (const objectName in expected) {
    if (actual[objectName]) {
      for (const propertyName in expected[objectName]) {
        if (actual[objectName][propertyName]) {
            if (JSON.stringify(expected[objectName][propertyName]) !== JSON.stringify(actual[objectName][propertyName])) {
              errors.push(`${objectName}.${propertyName} does not match expected result`)
            }
        } else {
          errors.push(`${objectName}.${propertyName} not found (should exist)`)
        }
      }
    } else {
      errors.push(`${objectName} not found (should exist)`)
    }
  }

  // Check for models and properties that exist but are not expected
  for (const objectName in actual) {
    if (expected[objectName]) {
      for (const propertyName in actual[objectName]) {
        if (!expected[objectName][propertyName]) {
          errors.push(`${objectName}.${propertyName} found (not expected)`)
        }
      }
    } else {
      errors.push(`${objectName} found (not expected)`)
    }
  }

  // Return true if no errors, else return array of errors
  return errors.length > 0 ? errors : true
}