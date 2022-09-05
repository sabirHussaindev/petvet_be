import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} from 'graphql';
import { s3 } from '../schema/s3.js';
import pkg from 'graphql-iso-date';
import Feed from '../../models/feed.js';
import Review from '../../models/review.js';
import User from '../../models/user.js';
import FeedTypes from './feed-types.js';
import ReviewTypes from './review-types.js';
import BrandTypes from './brand-types.js';
import ProductTypes from './product-types.js';
import UserTypes from './user-types.js';
import Product from '../../models/product.js';
import Brand from '../../models/brand.js';
const { GraphQLDateTime } = pkg;

// * USER TYPE
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    country: { type: GraphQLString },
    city: { type: GraphQLString },
    last_name: { type: GraphQLString },
    password: { type: GraphQLString },
    new_password: { type: GraphQLString },
    confirm_password: { type: GraphQLString },
    role: { type: GraphQLString },
    personal_feeds: { type: new GraphQLList(FeedType) },
    about: { type: GraphQLString },
    social_links: { type: SocialType },
    profile_pic: {
      type: GraphQLString,

      resolve(parent, args) {
        let imageUrl;
        if (parent.profile_pic) {
          imageUrl = s3.getSignedUrl('getObject', {
            Bucket: process.env.S3_BUCKET,
            Key: parent.profile_pic,
          });
        }
        return imageUrl || parent.profile_pic;
      },
    },
    token: { type: GraphQLString },
    token_expirtation: { type: GraphQLInt },
    message: { type: GraphQLString },
    createdAt: { type: GraphQLDateTime },
    updatedAt: { type: GraphQLDateTime },
    post_feed_ids: { type: new GraphQLList(GraphQLID) },
    reviews_ids: { type: new GraphQLList(GraphQLID) },
    post_feeds: {
      type: new GraphQLList(FeedTypes),
      resolve(parent, args) {
        return Feed.find({ _id: { $in: parent.post_feed_ids } });
      },
    },
    reviews: {
      type: new GraphQLList(ReviewTypes),
      resolve(parent, args) {
        return Review.find({ user_id: parent.id });
      },
    },
    brands: {
      type: new GraphQLList(BrandTypes),
      resolve(parent, args) {
        return Brand.find({ user_id: { $in: parent.id } });
      },
    },
    products: {
      type: new GraphQLList(ProductTypes),
      resolve(parent, args) {
        return Product.find({ user_id: { $in: parent.id } });
      },
    },
    all_reviews: {
      type: new GraphQLList(ReviewTypes),
      resolve(parent, args) {
        return Review.find();
      },
    },
    users: {
      type: new GraphQLList(UserTypes),
      resolve(parent, args) {
        return User.find();
      },
    },
  }),
});

const FeedType = new GraphQLObjectType({
  name: 'FeedLink',
  fields: () => ({
    link: { type: GraphQLString },
  }),
});
const SocialType = new GraphQLObjectType({
  name: 'Social',
  fields: () => ({
    facebook: { type: GraphQLString },
    twitter: { type: GraphQLString },
    instagram: { type: GraphQLString },
    linkedin: { type: GraphQLString },
    youtube: { type: GraphQLString },
    telegram: { type: GraphQLString },
    soundcloud: { type: GraphQLString },
    spotify: { type: GraphQLString },
    vkontakte: { type: GraphQLString },
  }),
});

export { SocialType, FeedType };

export default UserType;
