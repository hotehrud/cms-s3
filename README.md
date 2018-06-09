# Vue.js + S3 => TreeView CMS 

> You can build CMS for S3 bucket.

## functions
- Treeview for lists in S3 Bucket
- Drag And Drop
- Create, Delete, Rename for folder and file
- Upload for file
- Download for file
- Preview for file(Image, Audio, Video)

## Requirements
** Use this app along with the S3 Bucket **
- [AWS S3](https://aws.amazon.com/s3/)
- [aws-sdk for javascript](https://docs.aws.amazon.com/ko_kr/sdk-for-javascript/v2/developer-guide/getting-started-browser.html)
- [Vue.js](https://github.com/vuejs/vue) 
- vue-cli 2.x|vuex|vue-router|scss

## Directory Architecture

<pre>
 ┬  
 ├ assets
 ├ components
     ┬ 
     ├ *
     ├ shard-components
 ├ mixins
 ├ router
 ├ store
 ├ views
 ├ s3.js
</pre>

## Website UI

![alt website UI](src/assets/cms.png)

## Build Setup

** Need modify "bucket_name" variables in file **

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
