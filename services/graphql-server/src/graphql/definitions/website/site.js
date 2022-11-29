const gql = require('graphql-tag');

module.exports = gql`

extend type Query {
  websiteContext: WebsiteSite
  websiteSite(input: WebsiteSiteQueryInput!): WebsiteSite @findOne(model: "platform.Product", using: { id: "_id" }, criteria: "websiteSite")
  websiteSites(input: WebsiteSitesQueryInput = {}): WebsiteSiteConnection! @findMany(model: "platform.Product", criteria: "websiteSite")
  matchWebsiteSites(input: MatchWebsiteSitesQueryInput!): WebsiteSiteConnection! @matchMany(model: "platform.Product", criteria: "websiteSite")
}

extend type Mutation {
  updateWebsiteSiteHost(input: UpdateWebsiteSiteHostInput!): WebsiteSite! @requiresAuth
  updateWebsiteSiteURL(input: UpdateWebsiteSiteURLInput!): WebsiteSite! @requiresAuth
  updateWebsiteSiteImageHost(input: UpdateWebsiteSiteImageHostInput!): WebsiteSite! @requiresAuth
  updateWebsiteSiteAssetHost(input: UpdateWebsiteSiteAssetHostInput!): WebsiteSite! @requiresAuth
  updateWebsiteSiteDateConfig(input: UpdateWebsiteSiteDateConfigInput!): WebsiteSite! @requiresAuth
  updateWebsiteSiteLanguageConfig(input: UpdateWebsiteSiteLanguageConfigInput!): WebsiteSite! @requiresAuth
}

type WebsiteSite {
  # fields from platform.model::Product
  id: ObjectID! @projection(localField: "_id") @value(localField: "_id")
  name: String! @projection
  fullName: String @projection
  tagLine: String @projection
  description: String @projection
  logo: String @projection

  # fields from platform.trait::StatusEnabled
  status: Int @projection

  # fields directly on website.model::Product\Site
  sections(input: WebsiteSiteSectionsInput = {}): WebsiteSectionConnection!
    @projection(localField: "_id")
    @refMany(
      model: "website.Section",
      refQueryBuilder: "websiteSiteSections",
      localField: "_id",
      foreignField: "site.$id"
    )

  # pages: [WebsitePage] # add args? @todo Add this model
  options(input: WebsiteSiteOptionsInput = {}): WebsiteOptionConnection! @projection(localField: "_id") @refMany(model: "website.Option", localField: "_id", foreignField: "site.$id")
  url: String @projection
  # socialFollow: [PlatformEntityStubSocial]! @arrayValue
  redirects: [String]! @projection @arrayValue

  # fields that are new to GraphQL
  title: String @projection(localField: "name", needs: ["shortName"])
  shortName: String @projection
  rootSections(input: WebsiteSiteRootSectionsInput = {}): WebsiteSectionConnection! @projection(localField: "_id") @refMany(model: "website.Section", localField: "_id", foreignField: "site.$id", criteria: "rootWebsiteSection")
  host: String! @projection
  origin: String! @projection(localField: "host")
  imageHost: String! @projection
  assetHost: String! @projection
  date: WebsiteSiteDate! @projection
  language: WebsiteSiteLanguage! @projection
}

enum WebsiteSiteMatchField {
  name
}

type WebsiteSiteConnection @projectUsing(type: "WebsiteSite") {
  totalCount: Int!
  edges: [WebsiteSiteEdge]!
  pageInfo: PageInfo!
}

type WebsiteSiteEdge {
  node: WebsiteSite!
  cursor: String!
}

type WebsiteSiteDate {
  timezone: String! # tz database format, e.g. America/Chicago
  format: String! # moment.format()
  locale: String! # moment.locale()
}

type WebsiteSiteLanguage {
  code: String!
  primaryCode: String! # ISO 639-1
  subCode: String # https://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
}

enum WebsiteSiteSortField {
  id
  name
  fullName
}

input WebsiteSiteQueryInput {
  id: ObjectID!
  status: ModelStatus = active
}

input MatchWebsiteSitesQueryInput {
  status: ModelStatus = active
  pagination: PaginationInput = {}
  sort: WebsiteSiteSortInput = { order: asc }
  field: WebsiteSiteMatchField = name
  phrase: String!
  position: MatchPosition = contains
  match: MatchWords = all
  excludeIds: [Int!] = []
}

input WebsiteSitesQueryInput {
  status: ModelStatus = active
  sort: WebsiteSiteSortInput = {}
  pagination: PaginationInput = {}
}

input WebsiteSiteOptionsInput {
  status: ModelStatus = active
  sort: WebsiteOptionSortInput = {}
  pagination: PaginationInput = {}
}

input WebsiteSiteSortInput {
  field: WebsiteSiteSortField = id
  order: SortOrder = desc
}

input WebsiteSiteSectionsInput {
  includeAliases: [String!] = []
  excludeAliases: [String!] = []
  includeIds: [Int!] = []
  excludeIds: [Int!] = []
  rootOnly: Boolean = false
  taxonomyIds: [Int!] = []
  status: ModelStatus = active
  sort: WebsiteSectionSortInput = {}
  pagination: PaginationInput = {}
}

input WebsiteSiteRootSectionsInput {
  status: ModelStatus = active
  sort: WebsiteSectionSortInput = {}
  pagination: PaginationInput = {}
}

input UpdateWebsiteSiteHostInput {
  id: ObjectID!
  host: String!
}

input UpdateWebsiteSiteURLInput {
  id: ObjectID!
  url: String
}

input UpdateWebsiteSiteImageHostInput {
  id: ObjectID!
  imageHost: String!
}

input UpdateWebsiteSiteAssetHostInput {
  id: ObjectID!
  assetHost: String!
}

input WebsiteSiteDateInput {
  timezone: String! # tz database format, e.g. America/Chicago
  format: String! # moment.format()
  locale: String! # moment.locale()
}

input WebsiteSiteLanguageInput {
  code: String!
  primaryCode: String! # ISO 639-1
  subCode: String # https://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
}

input UpdateWebsiteSiteDateConfigInput {
  id: ObjectID!
  date: WebsiteSiteDateInput!
},

input UpdateWebsiteSiteLanguageConfigInput {
  id: ObjectID!
  language: WebsiteSiteLanguageInput!
}

`;
