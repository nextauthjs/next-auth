export default function PolicyPage() {
  return (
    <div className="mx-auto mt-10 max-w-screen-md space-y-4">
      <section>
        <h2 className="text-xl font-bold">Terms of Service</h2>
        <p>
          THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
          EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
          IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
          CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
          TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
          SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Privacy Policy</h2>
        <p>
          This site uses JSON Web Tokens and an in-memory database which resets
          every ~2 hours.
        </p>
        <p>
          Data provided to this site is exclusively used to support signing in
          and is not passed to any third party services, other than via SMTP or
          OAuth for the purposes of authentication.
        </p>
      </section>
    </div>
  )
}
