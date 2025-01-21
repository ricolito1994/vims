import { Route } from "./classes/route.class.js";
let pathname = window.location.search.split('?');
//console.log("",pathname);
let route = new Route();
route.load( Route.routes[ pathname[ pathname.length - 1 ] ]["url"] );