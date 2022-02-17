import {ApolloClient, gql, InMemoryCache} from "@apollo/client";
import { loader } from 'graphql.macro';

export default class GraphqlService {

    getData = async (query, id, category) => {

        const client = new ApolloClient({
            uri: 'http://localhost:4000',
            cache: new InMemoryCache(),
            defaultOptions: {
                query: {
                    fetchPolicy: 'no-cache',
                },
            },
        });
        //PLease, read 'Bug report.pdf' to understand why I disable cache in Apollo

        let queryOptions = {query: gql`${query}`};
        if (id) {queryOptions = {query: gql`${query}`,
            variables: {
                id: id
            }}}
        if (category) {queryOptions = {query: gql`${query}`,
            variables: {
                input: {
                    title: category
                }
            }}}

        const response = await client.query(queryOptions);
        console.log(response)
        return response.data;
    };

    getCategories = async () => {
        return await this.getData(loader('./queries/categories-data.graphql'))
    };

    getProductsForRoutes = async (category) => {
        return await this.getData(
            loader('./queries/products-for-routes.graphql'),
            0,
            category)
    };

    getCurrencies = async () => {
        return await this.getData(loader('./queries/currencies.graphql'))
    };

    getCategory = async (category) => {
        return await this.getData(
            loader('./queries/category-data.graphql'),
            0,
            category)
    };

    getProductData = async (id) => {
        return await this.getData(
            loader('./queries/product-data.graphql'),
            id)
    };
}