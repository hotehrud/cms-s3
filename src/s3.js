import AWS from "aws-sdk";
import store from "@/store/";
import router from "@/router";

let tower;
let s3;

export default function createS3() {
  if (!s3) {
    tower = new S3();
  }
  return tower;
}

class S3 {
  constructor(id, secret) {
    AWS.config.update({
      region: "REGION",
      credentials: new AWS.Credentials("CLIENT_ID", "CLIENT_SECRET")
    });
    s3 = new AWS.S3();
  }

  async getTreeList(params, lists, end) {
    return new Promise(reslove => {
      s3.listObjectsV2(params, (err, data) => {
        if (err) {
          throw err;
        } else {
          let contents = data.Contents;
          contents.forEach(function(content) {
            lists.push(content.Key);
          });

          if (data.IsTruncated) {
            let obj = Object.assign({}, params, {
              ContinuationToken: data.NextContinuationToken
            });
            this.getTreeList(obj, lists, reslove);
          } else {
            reslove();
            if (end) {
              end();
            }
          }
        }
      });
    });
  }

  renameFile(params, callback) {
    s3.copyObject(params, err => {
      if (err) {
        throw err;
      }
      if (typeof callback === "function") {
        let bucket = params.Bucket;
        let key = params.CopySource;

        this.deleteFile(
          {
            Bucket: bucket,
            Key: key.substr(bucket.length + 1)
          },
          callback
        );
      }
    });
  }

  deleteFile(params, callback) {
    s3.deleteObject(params, err => {
      if (err) {
        throw err;
      }
      if (typeof callback === "function") {
        callback();
        // Except, when display preview page about deleted file
        if (params.Key === store.getters.currentPath) {
          router.push({
            name: "Index"
          });
        }
        return;
      }
    });
  }

  async deleteFolder(params, callback) {
    const listedObjects = await s3.listObjectsV2(params).promise();

    if (listedObjects.Contents.length === 0) {
      return;
    }

    const deleteParams = {
      Bucket: params.Bucket,
      Delete: { Objects: [] }
    };

    listedObjects.Contents.forEach(({ Key }) => {
      deleteParams.Delete.Objects.push({ Key });
    });

    await s3.deleteObjects(deleteParams).promise();

    if (listedObjects.IsTruncated) {
      let obj = Object.assign({}, params, {
        ContinuationToken: listedObjects.NextContinuationToken
      });
      await this.deleteFolder(obj, callback);
    } else {
      if (typeof callback === "function") {
        callback();
        // Except, when display preview page about deleted file
        if (store.getters.currentPath.indexOf(params.Prefix) > -1) {
          router.push({
            name: "Index"
          });
        }
        return;
      }
    }
  }

  createFolder(params, callback) {
    s3.putObject(params).send(err => {
      if (err) {
        throw err;
      } else {
        if (typeof callback === "function") {
          callback();
        }
      }
    });
  }

  getFileBinary(params) {
    params.Key = store.getters.currentPath;
    return new Promise(reslove => {
      s3.getObject(params, (err, data) => {
        if (err) {
          throw err;
        }
        reslove(data);
      });
    });
  }

  getFileURL(params) {
    return new Promise(reslove => {
      s3.getSignedUrl("getObject", params, (err, url) => {
        if (err) {
          throw err;
        }
        reslove(url);
      });
    });
  }

  upload(params, callback) {
    return new Promise(reslove => {
      s3.upload(params)
        .on("httpUploadProgress", evt => {
          store.commit("progress", parseInt((evt.loaded * 100) / evt.total));
        })
        .send((err, data) => {
          if (err) {
            throw err;
          } else {
            if (typeof callback === "function") {
              callback();
              return;
            } else {
              const changeFile = async () => {
                let key = data.Key;
                let url = await this.getFileURL({
                  Bucket: params.Bucket,
                  Key: key
                });
                store.commit("fileURL", url);
              };
              changeFile();
            }
            reslove();
          }
        });
    });
  }
}
