let  Promise   = require("bluebird");
let fs = Promise.promisifyAll(require("fs"));
let  path   =  require("path");
let  fileCache  =  require("./cache")
let sftp  =  require("./sftp")

async function handle(filepath) {
    let  ups = await fs.readdirSync(filepath);
    // console.log(ups);
    //  todo  递归调用文件夹
    let temp   =  [];
    Promise.all(ups.map(async(one)=>{
      let appendPath   =  path.join(filepath,one);
      let stat = await fs.statSync(appendPath);
      if(stat.isDirectory()){
         handle(appendPath)
      }else if(stat.isFile()){
          // 上传文件到服务器
          // console.log(one)
          let  ret =  fileCache.getPath(one);
          // console.log(ret)
          // let  ret =  fileCache.test();
          temp.push({
              "localPath":one ,
              "romotePath":ret
          });
      }
    }));

    setTimeout(()=>{
        up(temp)
    },1000)
}


function up(arr){
   sftp.put(arr)
}


handle(path.resolve(__dirname,"./up"));