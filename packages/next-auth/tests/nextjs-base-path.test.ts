import getNextJsBasePath from "../src/utils/nextjs-base-path"

describe("getNextJsBasePath", () => {
    it("no basePath and / as pathname should result in an empty string", () => {
        expect(
            getNextJsBasePath({
                href: 'http://localhost:3000/',
                origin: 'http://localhost:3000',
                protocol: 'http:',
                username: '',
                password: '',
                host: 'localhost:3000',
                hostname: 'localhost',
                port: '3000',
                pathname: '/',
                search: '',
                searchParams: {},
                hash: ''
            })
        ).toEqual("");
    })

    it("no basePath and requested sub path should result in an empty string", () => {
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

    it("custom empty and / as pathname should return custom basePath", () => {
        expect(
            getNextJsBasePath({
                href: 'http://localhost:3000/custom-base',
                origin: 'http://localhost:3000',
                protocol: 'http:',
                username: '',
                password: '',
                host: 'localhost:3000',
                hostname: 'localhost',
                port: '3000',
                pathname: '/',
                search: '',
                searchParams: {},
                hash: ''
            })
        ).toEqual("/custom-base");
    })

    it("custom basePath should return custom basePath", () => {
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

    it("custom basePath and / as pathname with query should return custom basePath", () => {
        expect(
            getNextJsBasePath({
                href: 'http://localhost:3000/custom-base?test=1',
                origin: 'http://localhost:3000',
                protocol: 'http:',
                username: '',
                password: '',
                host: 'localhost:3000',
                hostname: 'localhost',
                port: '3000',
                pathname: '/',
                search: '?test=1',
                searchParams: {},
                hash: ''
            })
        ).toEqual("/custom-base");
    })

    it("custom basePath and requested sub path with query should return custom basePath", () => {
        expect(
            getNextJsBasePath({
                href: 'http://localhost:3000/custom-base/mocked/path?test=1',
                origin: 'http://localhost:3000',
                protocol: 'http:',
                username: '',
                password: '',
                host: 'localhost:3000',
                hostname: 'localhost',
                port: '3000',
                pathname: '/mocked/path',
                search: '?test=1',
                searchParams: {},
                hash: ''
            })
        ).toEqual("/custom-base");
    })
})