const gql = require('graphql-tag');
const userFragment = require('../fragments/active-user');

module.exports = ({ activeUserFragment, activeUserFragmentName }) => gql`
mutation UpdateOwnAppUserCustomAttributes($input: UpdateOwnAppUserCustomAttributesMutationInput!) {
  updateOwnAppUserCustomAttributes(input: $input) {
    id
    customAttributes
    ...ActiveUserFragment
    ${activeUserFragment ? `...${activeUserFragmentName || 'ActiveAppUserFragment'}` : ''}
  }
}

${userFragment}
${activeUserFragment || ''}

`;
