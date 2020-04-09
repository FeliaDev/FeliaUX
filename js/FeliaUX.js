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
            ": 'X' param must be a Boolean",
            ": 'X' param must be a Integer"
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

    HTMLParse(mapAttr, htmlChild = false){
        let match = new RegExp(Object.keys(mapAttr).join("|"),"gi");
        let htmlToParse = "";

        if(htmlChild == false){
            htmlToParse = this.sHtmlDynamic == "" ? this.sHtml : this.sHtmlDynamic;
        }else{
            htmlToParse = this.sHtmlChild;
        }

        return htmlToParse.replace(match, function(matched){
			return mapAttr[matched];
		});
    }

    pack(){
        this.ErrorThrow([`${this.constructor.name} with id ${this.sId}`, (ExistsInDocument(this) != true ? -1 : 7)]);
        
        if(this.add != undefined){
            this.add()
        }

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
    
    setPlaceholder(placeholder){
        this.ErrorThrow(["placeholder", typeof placeholder === "string" ? -1 : 3]);
        this.sPlaceholder = placeholder;
        this.jMapAttributes.PLACEHOLDERTEXT = this.sPlaceholder;
    }

    getPlaceholder(){
        return this.sPlaceholder;
    }

}

class InputNumber extends Input{
    constructor(entity, min = null, max = null, placeholder = ""){
        super(entity, placeholder)
        this.sHtml = `<input id="IDNAME" class="input-number CLASSNAME" min="MINRANGE" max="MAXRANGE" placeholder="PLACEHOLDERTEXT" type="number">`

        this.iMinRange = min;
        this.iMaxRange = max;
        this.jMapAttributes.MINRANGE = this.iMinRange == null ? "" : String(min);
        this.jMapAttributes.MAXRANGE = this.iMaxRange == null ? "" : String(min);

    }

    setMinRange(min){
        this.ErrorThrow(["min", typeof min == "number" ? -1 : 10]);
        this.iMinRange = min;
        this.jMapAttributes.MINRANGE = this.iMinRange;
    }

    setMaxRange(max){
        this.ErrorThrow(["max", typeof min == "number" ? -1 : 10]);
        this.iMaxRange = max;
        this.jMapAttributes.MAXRANGE = this.iMaxRange;
    }

    disableMinRange(){
        this.iMinRange = null;
        this.jMapAttributes.MINRANGE = "";
    }
    
    disableMaxRange(){
        this.iMinRange = null;
        this.jMapAttributes.MINRANGE = "";
    }

}

class InputPassword extends Input{
    constructor(entity, placeholder = ""){
        super(entity, placeholder);
        
        this.sHtml = `<input id="IDNAME" class="input-password CLASSNAME" placeholder="PLACEHOLDERTEXT" type="password">`;
    }
}

class RadioButton extends Widget{
    constructor(entity, check = false){
        super({"entity":entity}, {"config":{
            "html" : `<div id="IDNAME" data-check="CHECKED" class="radio-button CLASSNAME"><div id="IDNAME_circle"></div></div>`,
            "htmlChd" : '',
            "tagInsert":'',
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

class Checkbox extends Widget{
    constructor(entity, check = false){
        super({"entity":entity}, {"config":{
            "html" : `<div id="IDNAME" data-check="CHECKED" class="checkbox CLASSNAME"><div id="IDNAME_tilde1" class="checkbox-tilde-1"></div><div id="IDNAME_tilde2" class="checkbox-tilde-2"></div></div>`,
            "htmlChd" : '',
            "tagInsert":'',
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

class Text extends Widget{
    constructor(entity, width = 100, height = 100, text = "", placeholder = ""){
        super({"entity":entity}, {"config":{
            "html" : `<textarea id="IDNAME" class="textarea CLASSNAME" placeholder="PLACEHOLDERTEXT" style="width:WIDTHPX; height:HEIGHTPX;"></textarea>`,
            "htmlChd" : '',
            "tagInsert": `<div id="IDNAME" class="textarea CLASSNAME" placeholder="PLACEHOLDERTEXT" style="width:WIDTHPX; height:HEIGHTPX;">`,
            "mapAttr" : {
                "IDNAME" : "",
                "CLASSNAME" : "",
                "PLACEHOLDERTEXT": "",
                "WIDTHPX":"",
                "HEIGHTPX":"",
            },
            "mapAttrChd" : {}
        }});

        this.sTextConcent = text;
        this.sPlaceholder = placeholder;
        this.iWidth = width;
        this.iHeight = height;
        this.jMapAttributes.IDNAME = this.sId;
        this.jMapAttributes.CLASSNAME = this.sClass;
        this.jMapAttributes.PLACEHOLDERTEXT = this.sPlaceholder;
        this.jMapAttributes.WIDTHPX = `${String(this.iWidth)}px`;
        this.jMapAttributes.HEIGHTPX = `${String(this.iHeight)}px`;

        this.add();
    }

    setText(text){
        this.ErrorThrow(["text",(typeof text === "string") ? -1 : 2])
        this.sTextConcent = text;
        this.add();
    }

    getText(){
        if(ExistsInDocument(this) == true){
            return document.querySelector(`#${this.sId}`).value
        }

        return this.sTextConcent;   
    }

    getPlaceholder(){
        return this.sPlaceholder;
    }
    
    add(){
        this.sHtmlDynamic = this.sHtml.replace(this.sTagInsert, this.sTagInsert+this.sTextConcent);       
    }
}


class ListBox extends Widget{
    constructor(entity, rows = 2, width = 100, height = 100, list=[]){
        super({"entity":entity}, {"config":{
            "html" : `<select id="IDNAME" size="ROWS" class="listbox CLASSNAME" style="width:WIDTHPX; height:HEIGHTPX;"></select>`,
            "htmlChd" : '<option id="IDNAME" value="TEXT">TEXT</option>',
            "tagInsert": `<select id="IDNAME" size="ROWS" class="listbox CLASSNAME" style="width:WIDTHPX; height:HEIGHTPX;">`,
            "mapAttr" : {
                "IDNAME" : "",
                "CLASSNAME" : "",
                "PLACEHOLDERTEXT": "",
                "WIDTHPX":"",
                "HEIGHTPX":"",
                "ROWS":"",
            },
            "mapAttrChd" : {
                "IDNAME":"",
                "TEXT":"",
            }
        }});

        this.aElementList = list;

        this.iWidth = width;
        this.iHeight = height;
        
        this.jMapAttributes.IDNAME = this.sId;
        this.jMapAttributes.CLASSNAME = this.sClass;
        this.jMapAttributes.PLACEHOLDERTEXT = this.sPlaceholder;
        this.jMapAttributes.WIDTHPX = `${String(this.iWidth)}px`;
        this.jMapAttributes.HEIGHTPX = `${String(this.iHeight)}px`;
        this.jMapAttributes.ROWS = String(rows);

        this.jMapAttributesChild.IDNAME = this.sId;

        this.add();
    }
    add(){
        if(this.aElementList.length > 0){
            this.sHtmlDynamic = this.sHtml;
            let list = this.aElementList.reverse();
            for(let i=0; i<= this.aElementList.length -1; i++){
                this.jMapAttributesChild.TEXT = String(list[i]);
                this.jMapAttributesChild.IDNAME = `IDNAME_item${i}`
                this.sHtmlDynamic = this.sHtmlDynamic.replace(this.sTagInsert, `${this.sTagInsert}${this.HTMLParse(this.jMapAttributesChild, true)}`);
            }
        }
    }
    addElement(elm){
        this.aElementList.push(elm);
        this.add();
    }  
    
    addElementsList(list = []){
        this.aElementList.concat(list);
        this.add();
    }
    
    setElementsList(list = []){
        this.aElementList = list;
        this.add();
    }
    
    getElements(){
        return this.aElementList;
    }

    getIndexElement(index = 0){
        return this.aElementList[index];
    }
}

class ComboBox extends ListBox{
    constructor(entity, width = 100, height = 100, list=[]){
        super(entity, 1, width, height, list);

        this.sHtml = `<select id="IDNAME" size="ROWS" class="combo-box CLASSNAME" style="width:WIDTHPX; height:HEIGHTPX;"></select>`;
        this.sTagInsert = `<select id="IDNAME" size="ROWS" class="combo-box CLASSNAME" style="width:WIDTHPX; height:HEIGHTPX;">`;
    }
}

class Frame extends Widget{
    constructor(entity, width = -1, height = -1){
        super({"entity":entity}, {"config":{
            "html" : `<section id="IDNAME" class="frame CLASSNAME" style="width:WIDTHPX; height:HEIGHTPX;"></section>`,
            "htmlChd" : "",
            "tagInsert": "",
            "mapAttr" : {
                "IDNAME" : "",
                "CLASSNAME" : "",
                "WIDTHPX":"",
                "HEIGHTPX":"",
            },
            "mapAttrChd" : {}
        }});

        this.iWidth = width;
        this.iHeight = height;
        
        this.jMapAttributes.IDNAME = this.sId;
        this.jMapAttributes.CLASSNAME = this.sClass;
        this.jMapAttributes.PLACEHOLDERTEXT = this.sPlaceholder;
        this.jMapAttributes.WIDTHPX = this.iWidth == -1 ? "auto" : `${String(this.iWidth)}px`;
        this.jMapAttributes.HEIGHTPX = this.iHeight == -1 ? "auto" : `${String(this.iHeight)}px`;
    }
}

class Menu extends Widget{
    constructor(entity){
        super({"entity":entity}, {"config":{
            "html" : `<div id="IDNAME" class="menu CLASSNAME"></div>`,
            "htmlChd" : "",
            "tagInsert": "",
            "mapAttr" : {
                "IDNAME" : "",
                "CLASSNAME" : ""
            },
            "mapAttrChd" : {}
        }});

        this.jMapAttributes.IDNAME = this.sId;
        this.jMapAttributes.CLASSNAME = this.sClass;

        window.addEventListener("click", function(e){
            if(this.menuOpen != undefined && e.target.dataset.widget != "MenuSection"){
                document.querySelector(`#${this.menuOpen}_ItemContainer`).style.display = "none";
            }
        })
    }
}

class MenuSection extends Widget{
    constructor(entity, labelName = ""){
        super({"entity":entity}, {"config":{
            "html" : `<div data-widget="MenuSection" id="IDNAME" class="menu-section CLASSNAME"><p data-widget="MenuSection">LABEL</p><div data-widget="MenuSection" id="IDNAME_ItemContainer"></div></div>`,
            "htmlChd" : `<div data-widget="MenuSection" id="IDNAME_Item_ITEMID">ITEMLABEL</div>`,
            "tagInsert": `<div data-widget="MenuSection" id="IDNAME" class="menu-section CLASSNAME"><p data-widget="MenuSection">LABEL</p><div data-widget="MenuSection" id="IDNAME_ItemContainer">`,
            "mapAttr" : {
                "IDNAME" : "",
                "CLASSNAME" : "",
                "LABEL":""
            },
            "mapAttrChd" : {
                "ITEMLABEL":"",
                "ITEMID":""
            }
        }});
        
        this.sLabelName = labelName;
        this.aMenuItems = [];
        this.jMapAttributes.IDNAME = this.sId;
        this.jMapAttributes.CLASSNAME = this.sClass;
        this.jMapAttributes.LABEL = this.sLabelName;
    }

    addItem(labelName, command){
        this.aMenuItems.push({"name":labelName, "command":command});
    }

    add(){
        if(this.aMenuItems.length > 0){
            this.sHtmlDynamic = this.sHtml;
            let list = this.aMenuItems.reverse();
            for(let i=0; i<= this.aMenuItems.length -1; i++){
                this.jMapAttributesChild.ITEMLABEL = list[i]["name"];
                this.jMapAttributesChild.ITEMID = list[i]["name"].replace(/ /g,'');
                this.sHtmlDynamic = this.sHtmlDynamic.replace(this.sTagInsert, `${this.sTagInsert}${this.HTMLParse(this.jMapAttributesChild, true)}`);
            }
            this.aMenuItems.reverse();
        }
    }

    bindCommand(reference = undefined){
        const self = reference == undefined ? this : reference;
        if(self.aMenuItems.length > 0){
            let list = self.aMenuItems.reverse();
            for(let i=0; i<= self.aMenuItems.length -1; i++){
                self.ErrorThrow(["command", typeof list[i]["command"] === "function" ? -1 : 8]);
                document.querySelector(`#${self.sId}_Item_${list[i]["name"].replace(/ /g,'')}`).addEventListener("click", list[i]["command"]);
            }
            document.querySelector(`#${self.sId}`).addEventListener("click", ()=>{
                if(window.menuOpen != undefined && window.menuOpen != self.sId){
                    document.querySelector(`#${window.menuOpen}_ItemContainer`).style.display = "none";
                }
                document.querySelector(`#${self.sId}_ItemContainer`).style.display="block";
                window.menuOpen = self.sId;
            });
            this.aMenuItems.reverse();
        }
    }
}

class TopWindow extends Widget{
    constructor(id, className, title = "TopWindow", width = 200, height = 200, posX = 100, posY = 100){
        super({"entity":{"master":"ParentBody", "id":id, "class":className}}, {"config":{
            "html" : `<div id="IDNAME_TopWindow" class="top-window CLASSNAME" style="width:WIDTHPX;height:HEIGHTPX;left:POSX;top:POSY"><div id="IDNAME_FunctionBar" class="top-window-bar"><div><p id="IDNAME_FunctionBar_Title" class="top-window-title">TITLELABEL</p></div><div id="IDNAME_FunctionBar_ActionButtons" class="top-window-action-buttons"><div id="IDNAME_FunctionBar_ActionButtons_Close" class="top-window-bar-close-button"><div class="close-button-1"></div><div class="close-button-2"></div></div></div></div><div id="IDNAME" class="top-window-content-frame"></div></div>`,
            "htmlChd" : "",
            "tagInsert": "",
            "mapAttr" : {
                "IDNAME" : "",
                "CLASSNAME" : "",
                "TITLELABEL":"",
                "WIDTHPX":"",
                "HEIGHTPX":"",
                "POSX":"",
                "POSY":""
            },
            "mapAttrChd" : {}
        }});

        this.sTitle = title;
        this.iWidth = width;
        this.iHeight = height;
        this.iPosX = posX;
        this.iPosY = posY;

        this.jMapAttributes.IDNAME = this.sId;
        this.jMapAttributes.CLASSNAME = this.sClass;
        this.jMapAttributes.TITLELABEL = this.sTitle;
        this.jMapAttributes.WIDTHPX = String(this.iWidth)+"px";
        this.jMapAttributes.HEIGHTPX = String(this.iHeight)+"px";
        this.jMapAttributes.POSX = String(this.iPosX)+"px";
        this.jMapAttributes.POSY = String(this.iPosY)+"px";
    }

    bindCommand(reference = undefined){
        const self = reference == undefined ? this : reference;
        document.querySelector(`#${self.sId}_FunctionBar`).addEventListener("mousedown", function(e){
            document.mouse_drag = this;
            this.offset = [
                this.parentElement.offsetLeft - e.clientX,
                this.parentElement.offsetTop - e.clientY
            ];
        }, true);
        document.addEventListener("mouseup", function(){
            this.mouse_drag = null
        }, true);
        document.addEventListener("mousemove", function(event){
            event.preventDefault();
            if(this.mouse_drag != undefined || this.mouse_drag != null){
                let mousePosition = {
                    x : event.clientX,
                    y : event.clientY
                };
                this.mouse_drag.parentElement.style.left = (mousePosition.x + this.mouse_drag.offset[0]) + 'px';
                this.mouse_drag.parentElement.style.top  = (mousePosition.y + this.mouse_drag.offset[1]) + 'px';
            }
        }, true)

        document.querySelector(`#${self.sId}_FunctionBar_ActionButtons_Close`).addEventListener("click", function(){
            document.querySelector(`#${self.sId}_TopWindow`).remove()
        })
    }
}


