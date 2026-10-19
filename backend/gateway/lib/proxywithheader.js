// proxy with header
import proxy from 'express-http-proxy'

const proxyWithHeader = (targetUrl) => {
    return proxy(targetUrl, ({
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            if (srcReq.user && srcReq.userData.userId) {
                proxyReqOpts.headers["x-user-id"] = srcReq.userData.userId; // custom headers
            }
        }
    }))
};
export default proxyWithHeader

// all the concept q/a related to the proxy with header can be found in the following link
// https://stackoverflow.com/questions/70318792/how-to-add-custom-header-to-express-http-proxy
//Questions:
// 1. What is the purpose of the proxyWithHeader function?
{/* 
    // answer: The proxyWithHeader function is a middleware that allows you to create a proxy for a target URL while adding custom headers to the proxied request. It takes in a target URL and a header object, and returns a middleware function that can be used in an Express application. This is useful for scenarios where you need to forward requests to another service while including additional information in the headers, such as authentication tokens or custom metadata.
    */}
// 2. How does the proxyWithHeader function modify the headers of the proxied request?
{/*
    // answer: The proxyWithHeader function modifies the headers of the proxied request by using the proxyReqOptDecorator option provided by the express-http-proxy library. Inside this decorator, it merges the existing headers of the proxied request (proxyReqOpts.headers) with the custom headers provided in the header parameter. This way, when the request is forwarded to the target URL, it includes both the original headers and the additional custom headers specified.
    */}
// 3. What is the role of the proxyReqOptDecorator in the express-http-proxy library?
{/*
    // answer: The proxyReqOptDecorator is a function provided by the express-http-proxy library that allows you to modify the options of the proxied request before it is sent to the target server. It receives the current request options (proxyReqOpts) and the source request (srcReq) as parameters, and you can use it to customize various aspects of the request, such as headers, query parameters, or other request options. In this case, it is used to add custom headers to the proxied request.
    */}
// 4. How can you use the proxyWithHeader function in an Express application?
{/*
    // answer: You can use the proxyWithHeader function in an Express application by importing it and then using it as middleware for specific routes. For example, you can create a route that proxies requests to a target URL while adding custom headers. Here's an example of how to use it:*/}
// 5. What are some potential use cases for adding custom headers to proxied requests?
{/*
    // answer: Some potential use cases for adding custom headers to proxied requests include:
    // - Authentication: Adding tokens or API keys to authenticate requests to the target service.
    // - Tracing: Adding request IDs or other identifiers to track requests across multiple services.
    // - Custom Metadata: Including application-specific information in the headers for processing by the target service.
*/}