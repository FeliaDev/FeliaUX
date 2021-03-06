const ExistsInDocument = (widget) =>{
    return document.querySelector(`#${widget.getId()}`) != null
}

const GetInputValue = (widget) => {
    if((widget.constructor.__proto__.name != "Widget" && widget.constructor.name != "Input") || (widget.constructor.__proto__.name == "Widget" && widget.constructor.name != "Input")){
        throw ": From GetInputValue. The argument passed must be a Input Object";
    }

    return document.querySelector(`#${widget.getId()}`).value;
}

class Widget{

    constructor(entity, config){
        this.ErrorThrow(this.CheckParams(entity, config));

        this.sMaster = entity.entity["master"];
        this.sId = entity.entity["id"];
        this.sClass = entity.entity["class"];
        
        this.sHtml = config.config["html"];
        this.sHtmlChild = config.config["htmlChd"];
        this.sTagInsert = config.config["tagInsert"];

        this.jMapAttributes = config.config["mapAttr"];
        this.jMapAttributesChild = config.config["mapAttrChd"];

        this.sHtmlDynamic = "";
    }

    requiredParams = {
        "entity":[
            ["master", "013"], // Widget's Container;  Exists, Json, Not-Empty-Json
            ["id", "013"], // Widget's Id; Exists, String, Not-Empty-String
            ["class", "01"] // Widget's Class; Exists, String
        ], 
        "config":[
            ["html", "013"], // Widget's HTML; Exists, String, Not-Empty-String
            ["htmlChd", "01"], // Widget's Child HTML ; Exists, String.
            ["tagInsert", "01"], // Widget's Child HTML ; Exists, String.
            ["mapAttr", "024"],  // Widget's Map Attribute; Exists, Json, Not-Empty-Json
            ["mapAttrChd", "02"] // Widget's Child Map Attribute; Exists, Json.
        ]
    }

    CheckParams(){
        for(let i=0; i<=arguments.length -1; i++){
            
            let param = Object.keys(this.requiredParams)[i];
            let arg = arguments[i][param];

            if(arg.constructor !== ({}).constructor){
                return [param, 3]; // Not valid type. Must be JSON 
            }    

            for(let j=0; j<=this.requiredParams[param].length -1; j++){

                let elmName = this.requiredParams[param][j][0];
                let elmValid = this.requiredParams[param][j][1];
                
                if(elmValid.includes("0")){
                    if(!(elmName in arg)){
                        return [elmName, 0]; 
                    }
                }
                if(elmValid.includes("1")){
                    if(typeof arg[elmName] !== "string"){
                        return [elmName, 4];
                    }
                }
                if(elmValid.includes("2")){
                    if(arg[elmName].constructor !== ({}).constructor){
                        return [elmName, 3];
                    }
                }
                if(elmValid.includes("3")){
                    if(arg[elmName] == ""){
                        return [elmName, 6];
                    }
                }
                if(elmValid.includes("4")){
                    if(Object.keys(arg[elmName]).length == 0){
                        return [elmName, 5];
                    }
                }
            }
        }

        return ['X', -1]; // No Error
    }

    ErrorThrow(info){
        let errors = [
            ": 'X' is not defined",
            ": 'X' param must be a JSON",
            ": 'X' param must be a String",
            ": The value of 'X' key must be a JSON",
            ": The value of 'X' key must be a String",
            ": The value of 'X' key must be a non-empty JSON",
            ": The value of 'X' key must be a non-empty String",
            ": The 'X' widget it is already loaded in document",
            ": 'X' param must be a Function",
            ": 'X' param must be a Boolean"
        ];

        if(info[1] != -1){
            throw errors[info[1]].replace("X", info[0]);
        }
    }

    getMaster(){
        return this.sMaster;
    }

    getId(){
        return this.sId;
    }

    getClass(){
        return this.sClass;
    }

    HTMLParse(mapAttr){
        let match = new RegExp(Object.keys(mapAttr).join("|"),"gi");
        let htmlToParse = this.sHtmlDynamic == "" ? this.sHtml : this.sHtmlDynamic;

        return htmlToParse.replace(match, function(matched){
			return mapAttr[matched];
		});
    }

    pack(){
        this.ErrorThrow([`${this.constructor.name} with id ${this.sId}`, (ExistsInDocument(this) != true ? -1 : 7)]);
        document.querySelector(`#${this.sMaster}`).innerHTML += this.HTMLParse(this.jMapAttributes);
        
        if(this.bindCommand != undefined){
            const self = this;
            document.addEventListener("DOMContentLoaded", function() {
                self.bindCommand(self);    
            });
        }
    }
}
class Label extends Widget{
    constructor(entity, text = ""){
        super({"entity":entity}, {"config":{
            "html" : `<span id="IDNAME" class="label CLASSNAME"></span>`,
            "htmlChd" : '',
            "tagInsert":`<span id="IDNAME" class="label CLASSNAME">`,
            "mapAttr" : {
                "IDNAME" : "",
                "CLASSNAME" : "",
            },
            "mapAttrChd" : {}
        }});

        this.sTextConcent = text;
        this.jMapAttributes.IDNAME = this.sId;
        this.jMapAttributes.CLASSNAME = this.sClass;
        
        this.add();
    }

    setText(text){
        this.ErrorThrow(["text",(typeof text === "string") ? -1 : 2])
        this.sTextConcent = text;
        this.add();
    }

    getText(){
        return this.sTextConcent;
    }

    add(){
        this.sHtmlDynamic = this.sHtml.replace(this.sTagInsert, this.sTagInsert+this.sTextConcent);       
    }

}

class Button extends Widget{
    constructor(entity, text = "", command = undefined){
        super({"entity":entity}, {"config":{
            "html" : `<div id="IDNAME" class="button CLASSNAME"><span id="IDNAME_BtnText"></span></div>`,
            "htmlChd" : '',
            "tagInsert":`<div id="IDNAME" class="button CLASSNAME"><span id="IDNAME_BtnText">`,
            "mapAttr" : {
                "IDNAME" : "",
                "CLASSNAME" : "",
            },
            "mapAttrChd" : {}
        }});

        this.sTextConcent = text;
        this.jMapAttributes.IDNAME = this.sId;
        this.jMapAttributes.CLASSNAME = this.sClass;
        this.fCommand = command;

        this.add();
    }

    setText(text){
        this.ErrorThrow(["text",(typeof text === "string") ? -1 : 2])
        this.sTextConcent = text;
        this.add();
    }

    getText(){
        return this.sTextConcent;
    }

    add(){
        this.sHtmlDynamic = this.sHtml.replace(this.sTagInsert, this.sTagInsert+this.sTextConcent);       
    }

    bindCommand(reference = undefined){
        const self = reference == undefined ? this : reference;
        self.ErrorThrow(["command", typeof self.fCommand === "function" ? -1 : 8]);
        
        document.querySelector(`#${self.sId}`).addEventListener("click", self.fCommand);
    }

}

class Input extends Widget{
    constructor(entity, placeholder = ""){
        super({"entity":entity}, {"config":{
            "html" : `<input id="IDNAME" class="input CLASSNAME" placeholder="PLACEHOLDERTEXT">`,
            "htmlChd" : '',
            "tagInsert": "",
            "mapAttr" : {
                "IDNAME" : "",
                "CLASSNAME" : "",
                "PLACEHOLDERTEXT": "",
            },
            "mapAttrChd" : {}
        }});

        this.sPlaceholder = placeholder;
        this.jMapAttributes.IDNAME = this.sId;
        this.jMapAttributes.CLASSNAME = this.sClass;
        this.jMapAttributes.PLACEHOLDERTEXT = this.sPlaceholder;
    }

    getPlaceholder(){
        return this.sPlaceholder;
    }

}

class RadioButton extends Widget{
    constructor(entity, check = false){
        super({"entity":entity}, {"config":{
            "html" : `<div id="IDNAME" data-check="CHECKED" class="radio-button CLASSNAME"><div id="IDNAME_circle"></div></div>`,
            "htmlChd" : '',
            "tagInsert":`<div id="IDNAME" class="button CLASSNAME"><span id="IDNAME_BtnText">`,
            "mapAttr" : {
                "IDNAME" : "",
                "CLASSNAME" : "",
                "CHECKED" : ""
            },
            "mapAttrChd" : {}
        }});

        this.ErrorThrow(["check", typeof check === "boolean" ? -1 : 9]);

        this.bCheck = check;
        
        this.jMapAttributes.IDNAME = this.sId;
        this.jMapAttributes.CLASSNAME = this.sClass;
        this.jMapAttributes.CHECKED = String(this.bCheck);

        this.fCommand = ()=>{
            if(this.bCheck == false){
                document.querySelector(`#${this.sId}`).setAttribute("data-check","true");
                this.bCheck = true;
            }else{
                document.querySelector(`#${this.sId}`).setAttribute("data-check","false")
                this.bCheck = false;
            }
            
        };
    }

    getCheck(){
        return this.bCheck;
    }

    bindCommand(reference = undefined){
        const self = reference == undefined ? this : reference;
        self.ErrorThrow(["command", typeof self.fCommand === "function" ? -1 : 8]);
        
        self.bCheck = !(this.bCheck);
        self.fCommand();
        
        document.querySelector(`#${self.sId}`).addEventListener("click", self.fCommand);

        self.bCheck = !(this.bCheck);
    }

}