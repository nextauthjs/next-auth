import Layout from '../components/layout'

export default function Page () {
  return (
    <Layout>
      <p>
        This is an example site to demonstrate how to use <a href={`https://next-auth.js.org`}>NextAuth.js</a> for authentication.
      </p>
      <h2>Terms of Service</h2>
      <p>
        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
        SOFTWARE.
      </p>
      <h2>Privacy Policy</h2>
      <p>
        This site uses JSON Web Tokens and an in-memory database which resets every ~2 hours.
      </p>
      <p>
        Data provided to this site is exclusively used to support signing in
        and is not passed to any third party services, other than via SMTP or OAuth for the
        purposes of authentication.
      </p>
    </Layout>
  )
}