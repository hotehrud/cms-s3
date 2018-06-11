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
      credentials: new AWS.Credentials(id, secret)
    });
    s3 = new AWS.S3();
  }

  async bridge(kind, params, optional) {
    let result;

    switch (kind) {
      case "getTreeList":
        await this.getTreeList(params, optional);
        break;
      case "getFileBinary":
        result = await this.getFileURL(params);
        break;
      case "getFileURL":
        result = await this.getFileURL(params);
        break;
      case "renameFile":
        await this.renameFile(params);
        break;
      case "deleteFile":
        await this.deleteFile(params);
        break;
      case "deleteFolder":
        await this.deleteFolder(params);
        break;
      case "createFolder":
        await this.createFolder(params);
        break;
      case "upload":
        await this.upload(params, optional);
        break;
    }
    return result;
  }

  async getTreeList(params, lists) {
    const data = await s3.listObjectsV2(params).promise();
    const contents = data.Contents;
    contents.forEach(content => {
      lists.push(content.Key);
    });

    if (data.IsTruncated) {
      let obj = Object.assign({}, params, {
        ContinuationToken: data.NextContinuationToken
      });
      await this.getTreeList(obj, lists, reslove);
    }
  }

  renameFile(params) {
    return new Promise(reslove => {
      s3.copyObject(params, async err => {
        if (err) {
          throw err;
        }
        let bucket = params.Bucket;
        let key = params.CopySource;

        await this.deleteFile({
          Bucket: bucket,
          Key: key.substr(bucket.length + 1)
        });
        reslove();
      });
    });
  }

  deleteFile(params) {
    return new Promise(reslove => {
      s3.deleteObject(params, err => {
        if (err) {
          throw err;
        }
        // Except, when display preview page about deleted file
        if (params.Key === store.getters.currentPath) {
          router.push({
            name: "Index"
          });
        }
        reslove();
      });
    });
  }

  async deleteFolder(params) {
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
      await this.deleteFolder(obj);
    } else {
      if (store.getters.currentPath.indexOf(params.Prefix) > -1) {
        router.push({
          name: "Index"
        });
      }
    }
  }

  createFolder(params) {
    return new Promise(reslove => {
      s3.putObject(params).send(err => {
        if (err) {
          throw err;
        }
        reslove();
      });
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

  upload(params, refresh) {
    return new Promise(reslove => {
      s3.upload(params)
        .on("httpUploadProgress", evt => {
          store.commit("progress", parseInt((evt.loaded * 100) / evt.total));
        })
        .send(async (err, data) => {
          if (err) {
            throw err;
          }

          if (!refresh) {
            let key = data.Key;
            let url = await this.getFileURL({
              Bucket: "test-vtouch",
              Key: key
            });
            store.commit("fileURL", url);
          }
          reslove();
        });
    });
  }
}
