import Admin from "./Admin";
import ClientResource from "../api/resources/client";

let resource = new ClientResource();

export default class Client extends Admin {

    static resource = resource;
    resource = resource;

}