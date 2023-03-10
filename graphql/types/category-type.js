import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
} from 'graphql';
import { s3 } from '../schema/s3.js';
import pkg from 'graphql-iso-date';
import { GraphQLList } from 'graphql';
import { SubCategoryType } from './sub-category-type.js';
import SubCategory from '../../models/sub-category.js';

const { GraphQLDateTime } = pkg;

// * Category TYPE
const CategoryType = new GraphQLObjectType({
    name: 'Category',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        slug: { type: GraphQLString },
        image: { type: GraphQLString },
        sub_category: {
            type: new GraphQLList(SubCategoryType),
            resolve(parent, args) {
                return SubCategory.find({ category_id: parent.id })
            },
        },
        token: { type: GraphQLString },
        token_expirtation: { type: GraphQLInt },
        createdAt: { type: GraphQLDateTime },
        updatedAt: { type: GraphQLDateTime },

    }),
});


export default CategoryType;
