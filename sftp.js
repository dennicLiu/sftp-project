let  Client   =  require("ssh2-sftp-client");
let config    = require("./config/sshConfig.json").test

// 上传服务器
exports.put  = function put(arr){
    let sftp = new Client();
    sftp.connect({
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password
    }).then(async() => {
       let ret  = await Promise.all(arr.map(async(one)=>{
           await sftp.put(one.localPath,one.romotePath)
        }));
    }).then(() =>{
        console.log("上传完成");
    }).catch((err) => {
        console.log(err, 'catch error');
    });
};