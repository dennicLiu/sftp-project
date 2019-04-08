let  Promise   = require("bluebird");
let fs = Promise.promisifyAll(require("fs"));
let  path   =  require("path");
let  os   = require("os");

class  cache {
    constructor(){
        this.pathCache   =  {};
        this.resource  =  require("./config/path.json").path;
        this.pathPre  = null;
        this.platform   = null;
        this.init()
    }

    async init(){
        let self = this;
        await  self.readFile(this.resource);
        let platform  =  os.type().toLowerCase();
        if(platform.indexOf("wind")>=0){
            self.platform  = "Window";
        }else if(platform.indexOf("linux">=0)){
            self.platform = "Linux";
            this.pathPre = "/data/qmx";
        }
    }


    async readFile(filepath){
        let self  = this;
        let  ret    = await fs.readdirSync(filepath);
        ret  = ret.filter((el)=>{return el !=="node_modules"&& el !==".idea"});
        ret.map(async(el)=>{
            if(self.platform === "Linux"){
                filepath =  filepath.split("qmx")[1];
                filepath  =  self.pathPre + filepath;
            }
            let appendPath  = path.join(filepath,el);
            let stat = await fs.statSync(appendPath);
            if(stat.isDirectory()){
                self.readFile(path.resolve(appendPath));
            }else if(stat.isFile()){
                self.pathCache[el] = appendPath
            }
        });
    }


    getPath(filename){
        if(this.pathCache[filename]){
            return this.pathCache[filename]
        }else{
            return null
        }
    }

    test(){
        if(this.pathCache){
            return this.pathCache
        }else{
            return null
        }
    }
}


module.exports =  new cache();