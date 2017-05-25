// @flow
import Relay from "react-relay";

const SubFatQuery = Relay.QL`
    fragment on ArticleMutationPayload {
        subNotes,
        article {
            notes(first: 10) {
              edges
            }
        }
    }      
`;
const AddFatQuery = Relay.QL`
    fragment on ArticleMutationPayload {
        newNotes,
        article {
            notes(first: 10) {
              edges
            }
        }
    }
`;
const getSubConfig = parentID => {
  return [
    {
      type: "NODE_DELETE",
      parentName: "article",
      parentID,
      connectionName: "notes.edges",
      deletedIDFieldName: "subNotes"
    }
  ];
};
const getAddConfig = parentID => {
  // console.log(
  //   "-------------getConfigs---Add-----------parentID--------",
  //   parentID
  // );
  return [
    {
      type: "RANGE_ADD",
      parentName: "article",
      parentID,
      connectionName: "notes.edges",
      edgeName: "newNotes",
      rangeBehaviors: {
        "": "ignore"
      }
      // rangeBehaviors: (ast: any) => {
      //   console.log("ast---------------------:", ast);
      //   if (ast.id === parentID) {
      //     return "append";
      //   } else {
      //     return "ignore";
      //   }
      // }
    }
  ];
};
export default class NoteMutation extends Relay.Mutation {
  static fragments = {
    node: () => Relay.QL`
            fragment on Article {
                id
            }
        `
  };
  getMutation() {
    return Relay.QL`
        mutation { saveArticle }
    `;
  }
  getFatQuery() {
    if (this.props.noteId) {
      // console.log("------------getFatQuery----Sub-------------------");
      return SubFatQuery;
    } else {
      // console.log("-----------getFatQuery-----Add-------------------");
      return AddFatQuery;
    }
  }
  getConfigs() {
    // console.log("this.props", this.props);
    if (this.props.noteId) {
      // console.log(
      //   "----------getConfigs------Sub-------------------",
      //   this.props.node.id
      // );
      return getSubConfig(this.props.node.id);
    } else {
      // console.log(
      //   "-------------getConfigs---Add-------------------",
      //   this.props.node.id
      // );
      return getAddConfig(this.props.node.id);
    }
  }
  getVariables() {
    const { noteId, text, noteIndex = 100 } = this.props;
    if (noteId) {
      return {
        id: this.props.node.id,
        subNotes: noteId ? [noteId] : [noteId]
      };
    } else {
      return {
        id: this.props.node.id,
        addNotes: text ? [text] : [],
        noteIndex
      };
    }
  }
}
