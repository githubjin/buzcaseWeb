// @flow

import Relay from "react-relay";
// mutations
const genderMutation = Relay.QL`
    mutation { GenderMutation }
`;
const categoryMutation = Relay.QL`
    mutation { CategoryMutation }
`;
const educationMutation = Relay.QL`
    mutation { EducationMutation }
`;
const jobMutation = Relay.QL`
    mutation { JobMutation }
`;
const marriageMutation = Relay.QL`
    mutation { MarriageMutation }
`;
// fatquery
const jobFatQuery = Relay.QL`
    fragment on JobMutationPayload {
        newEdge,
        distroyedId,
        master {
            dic
        }
        error
    }
`;
const genderFatQuery = Relay.QL`
    fragment on GenderMutationPayload {
        newEdge,
        distroyedId,
        master {
            dic
        }
        error
    }
`;
const categoryFatQuery = Relay.QL`
    fragment on CategoryMutationPayload {
        newEdge,
        distroyedId,
        master {
            dic
        }
        error
    }
`;
const educationFatQuery = Relay.QL`
    fragment on EducationMutationPayload {
        newEdge,
        distroyedId,
        master {
            dic
        }
        error
    }
`;
const marriageFatQuery = Relay.QL`
    fragment on MarriageMutationPayload {
        newEdge,
        distroyedId,
        master {
            dic
        }
        error
    }
`;
// configs
function getAddconfigs(type: string, masterId: string) {
  var prefix = `code("${type}").first(99999)`;
  var rangeBehaviors = { "": "ignore" };
  rangeBehaviors[prefix] = "append";
  return [
    {
      type: "RANGE_ADD",
      parentName: "master",
      parentID: masterId,
      connectionName: "dic",
      edgeName: "newEdge",
      rangeBehaviors: (ast: any) => {
        console.log(ast);
        if (ast.code === type) {
          return "append";
        } else {
          return "ignore";
        }
      }
    }
  ];
}
function getSubConfig(masterId: string) {
  return [
    {
      type: "NODE_DELETE",
      parentName: "master",
      parentID: masterId,
      connectionName: "dic",
      deletedIDFieldName: "distroyedId"
    }
  ];
}

export default class DictionaryMutation extends Relay.Mutation {
  static fragments = {
    master: () => Relay.QL`
        fragment on MasterType {
        id
    }
    `
  };
  getMutation() {
    switch (this.props.type) {
      case "Gender":
        return genderMutation;
      case "Category":
        return categoryMutation;
      case "Education":
        return educationMutation;
      case "Marriage":
        return marriageMutation;
      case "Job":
        return jobMutation;
      default:
        return null;
    }
  }
  getFatQuery() {
    switch (this.props.type) {
      case "Gender":
        return genderFatQuery;
      case "Category":
        return categoryFatQuery;
      case "Education":
        return educationFatQuery;
      case "Marriage":
        return marriageFatQuery;
      case "Job":
        return jobFatQuery;
      default:
        return null;
    }
  }
  getConfigs() {
    if (this.props.id) {
      return getSubConfig(this.props.master.id);
    } else {
      return getAddconfigs(this.props.type, this.props.master.id);
    }
  }
  getVariables() {
    return {
      id: this.props.id,
      name: this.props.name,
      order: this.props.order
    };
  }
}
