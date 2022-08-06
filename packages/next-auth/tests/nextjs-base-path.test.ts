import getNextJsBasePath from "../src/utils/nextjs-base-path"

describe("getNextJsBasePath", () => {
    it("no basePath should result in an empty string", () => {
        expect(
            getNextJsBasePath({
                href: 'http://localhost:3000/mocked/path',
                origin: 'http://localhost:3000',
                protocol: 'http:',
                username: '',
                password: '',
                host: 'localhost:3000',
                hostname: 'localhost',
                port: '3000',
                pathname: '/mocked/path',
                search: '',
                searchParams: {},
                hash: ''
            })
        ).toEqual("");
    })

    it("custom basePath should return the correct basePath", () => {
        expect(
            getNextJsBasePath({
                href: 'http://localhost:3000/custom-base/mocked/path',
                origin: 'http://localhost:3000',
                protocol: 'http:',
                username: '',
                password: '',
                host: 'localhost:3000',
                hostname: 'localhost',
                port: '3000',
                pathname: '/mocked/path',
                search: '',
                searchParams: {},
                hash: ''
            })
        ).toEqual("/custom-base");
    })
})