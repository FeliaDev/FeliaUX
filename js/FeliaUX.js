/**
 * FeliaUX es una librería en Javascript que permite crear interfaces gráficas asemejandose a un programa de escritorio.
 * Esta librería utiliza objectos de interfaz llamados Widgets.
 * los Widgets son clases hijas del la Clase Maestra Widget.
**/

/*Retorna el True|False dependiendo de si el widget se encuentra en el DOM HTML*/
const ExistsInDocument = (widget) =>{ // Widget : la instancia Widget a verificar
    return document.querySelector(`#${widget.getId()}`) != null
}

/* Clase Maestra donde se encuentra la funcionalidad básica y global de todos los widgets */
class Widget{

    constructor(entity, config){ // entity : JSON (master, id, class); config : JSON (html, htmlChd, tagInsert, mapAttr, mapAttrChd)
        this.ErrorThrow(this.CheckParams(entity, config)); // Valida que los parametros, en caso de no ser correctos arroja un Error

        this.sMaster = entity.entity["master"]; // Id HTML del elemento al que pertenecerá una vez empaquetado en el DOM
        this.sId = entity.entity["id"]; // Id HTML que tendrá el elemento en el DOM
        this.sClass = entity.entity["class"]; // Class HTML que tendrá el elemento en el DOM
        
        this.sHtml = config.config["html"]; // Tag HTML
        this.sHtmlChild = config.config["htmlChd"]; // Tag HTML hija  
        this.sTagInsert = config.config["tagInsert"]; //Tag HTML que delimita donde se insertará la Tag HTML Hija

        this.jMapAttributes = config.config["mapAttr"]; // Mapa de Atributos para la Tag HTML
        this.jMapAttributesChild = config.config["mapAttrChd"]; // Mapa de Atributos para la Tag HTML Hija

        this.sHtmlDynamic = ""; // Tag HTML Dinámica
    }

    /* Contiene la información para validar los parámetros del constructor */
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
    /* Valida aquello que se le pase como parámetros  en base al requiredParams */
    CheckParams(){
        for(let i=0; i<=arguments.length -1; i++){ // Recorre todo los argumentos que se le pasen a la función
            
            let param = Object.keys(this.requiredParams)[i]; // Obtiene el nombre de los parametros a validar en base a la var I
            let arg = arguments[i][param]; // Obtiene el contenido de los argumentos en base a la var I y la var Param

            if(arg.constructor !== ({}).constructor){ // Valida que los argumentos sean de tipo JSON
                return [param, 3]; // Not valid type. Must be JSON 
            }    

            for(let j=0; j<=this.requiredParams[param].length -1; j++){ // Recorre el contenido en requiredParams en base a la variable Param

                let elmName = this.requiredParams[param][j][0]; // Obtiene el nombre
                let elmValid = this.requiredParams[param][j][1]; // Obtiene la validación
                
                if(elmValid.includes("0")){ // Valida que exista
                    if(!(elmName in arg)){
                        return [elmName, 0]; // 0 : Error por inexistencia
                    }
                }
                if(elmValid.includes("1")){ // Valida que sea de tipo String
                    if(typeof arg[elmName] !== "string"){
                        return [elmName, 4]; // 4 : Error por no ser de tipo String
                    }
                }
                if(elmValid.includes("2")){ // Valida que sea tipo JSON
                    if(arg[elmName].constructor !== ({}).constructor){
                        return [elmName, 3]; // 3 : Error por no ser de tipo String
                    }
                }
                if(elmValid.includes("3")){ // Valida que no sea un string vacío
                    if(arg[elmName] == ""){
                        return [elmName, 6]; // 6 : Error por ser un string vacío
                    }
                }
                if(elmValid.includes("4")){ // Valida que no sea un JSON vacío
                    if(Object.keys(arg[elmName]).length == 0){
                        return [elmName, 5]; // 5 : Error por ser un JSON vacío
                    }
                }
            }
        }

        return ['X', -1]; // -1 : No Error
    }

    /* En base a su la información que se le pase arroja un error de JS */
    ErrorThrow(info){ // info : Array(nameReplace, errorValue) 
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

        if(info[1] != -1){ // Valida que el ErrorValue sea dinstinto de -1
            throw errors[info[1]].replace("X", info[0]);
        }
    }

    /* Retorna el valor del Master */
    getMaster(){
        return this.sMaster;
    }

    /* Retorna el valor de la Id */
    getId(){
        return this.sId;
    }

    /* Retorna el valor de la Class */
    getClass(){
        return this.sClass;
    }

    /* Retorna un String HTML en base a la Tag y el Mapa de Atributos */
    HTMLParse(mapAttr, htmlChild = false){ // mapAttr : JSON (mapAttributes), htmlChild : Bool

        let match = new RegExp(Object.keys(mapAttr).join("|"),"gi"); // Obtiene todos los keys del mapAttr y los une en un Regex
        let htmlToParse = ""; // Variable que contendrá el HTML a mapear con el Regex. (Tag/Tag Hija)

        if(htmlChild == false){ // Valida que htmlChild sea false
            htmlToParse = this.sHtmlDynamic == "" ? this.sHtml : this.sHtmlDynamic; // Valida que el HTML Dinámico este vacío para establecer la Tag, caso contrario establece el HTML dinámico

        }else{ // HtmlChild es true
            htmlToParse = this.sHtmlChild;  // Establece la Tag Hija para mapear
        }

        return htmlToParse.replace(match, function(matched){ // Mapea la Tag y la retorna
			return mapAttr[matched];
		});
    }

    /* Instancia el Widget ya parseado en el DOM*/
    pack(){
        this.ErrorThrow([`${this.constructor.name} with id ${this.sId}`, (ExistsInDocument(this) != true ? -1 : 7)]); // Arroja un Error en caso de que el Widget ya haya sido empaquetado
        
        if(this.add != undefined){ // Valida que la función Add exista
            this.add() //Ejecuta la función Add
        }

        document.querySelector(`#${this.sMaster}`).innerHTML += this.HTMLParse(this.jMapAttributes); // Agrega al DOM, dentro del master, el Widget Parseado
        
        if(this.bindCommand != undefined){ // Valida que la función BindCommand exista
            const self = this; // Obtiene la instancia del Widget
            document.addEventListener("DOMContentLoaded", function() { // Ejecuta el BindCommand una vez se cargue el DOM
                self.bindCommand(self);    
            });
        }
    }
}

/* Widget que permite visualizar una Label con un texto dentro */
class Label extends Widget{
    constructor(entity, text = ""){ // entity : JSON(master, id, class); text : String
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
    }

    /* Permite cambiar el texto del widget antes de ser empaquetada */
    setText(text){
        this.ErrorThrow(["text",(typeof text === "string") ? -1 : 2])
        this.sTextConcent = text;
    }

    /* Retorna el texto del Widget */
    getText(){
        return this.sTextConcent;
    }

    /* Permite añadir el texto a la tag del Widget */
    add(){
        this.sHtmlDynamic = this.sHtml.replace(this.sTagInsert, this.sTagInsert+this.sTextConcent);       
    }

}

/* Widget que permite visualizar un Botón con un texto dentro al cual se le pude presionar con el mouse para ejecutar un comando */
class Button extends Widget{
    constructor(entity, text = "", command = undefined){ // entity : JSON(master, id, class); text : String; command : Function
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

    }

    /* Permite cambiar el texto del widget antes de ser empaquetada */
    setText(text){
        this.ErrorThrow(["text",(typeof text === "string") ? -1 : 2])
        this.sTextConcent = text;
    }
    
    /* Retorna el texto del Widget */
    getText(){
        return this.sTextConcent;
    }

    add(){
        this.sHtmlDynamic = this.sHtml.replace(this.sTagInsert, this.sTagInsert+this.sTextConcent);       
    }

    /* Establece el comando que se ejecutará cuando se le presione con el mouse al Widget */
    bindCommand(reference = undefined){
        const self = reference == undefined ? this : reference;
        self.ErrorThrow(["command", typeof self.fCommand === "function" ? -1 : 8]);
        
        document.querySelector(`#${self.sId}`).addEventListener("click", self.fCommand);
    }

}
/* Widget que permite visualizar una Entrada de Texto horizontal en el cual se puede escribir*/
class Input extends Widget{
    constructor(entity, placeholder = ""){ // entity : JSON(master, id, class); placeholder : String
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
    
    /* Permite cambiar el placeholder del widget antes de ser empaquetada */
    setPlaceholder(placeholder){
        this.ErrorThrow(["placeholder", typeof placeholder === "string" ? -1 : 3]);
        this.sPlaceholder = placeholder;
        this.jMapAttributes.PLACEHOLDERTEXT = this.sPlaceholder;
    }

    /* Retorna el placeholder del widget*/
    getPlaceholder(){
        return this.sPlaceholder;
    }

    /* Retorna el texto del widget dinamicamente */
    getContent(){
        return ExistsInDocument(this) == true ? document.querySelector(`#${this.sId}`).value : "";
    }

}

/* Widget que permite visualizar una Entrada de Digitos en el cual se puede escribir*/
class InputNumber extends Input{
    constructor(entity, min = null, max = null, placeholder = ""){ // entity : JSON(master, id, class); min : Int; max : Int; placeholder : String
        super(entity, placeholder)
        this.sHtml = `<input id="IDNAME" class="input-number CLASSNAME" min="MINRANGE" max="MAXRANGE" placeholder="PLACEHOLDERTEXT" type="number">`
        this.iMinRange = min;
        this.iMaxRange = max;
        this.jMapAttributes.MINRANGE = this.iMinRange == null ? "" : String(min);
        this.jMapAttributes.MAXRANGE = this.iMaxRange == null ? "" : String(min);

    }

    /* Permite establecer el rango minimo del Widget*/
    setMinRange(min){ // min : Int
        this.ErrorThrow(["min", typeof min == "number" ? -1 : 10]);
        this.iMinRange = min;
        this.jMapAttributes.MINRANGE = this.iMinRange;
    }

    /* Permite establecer el rango máximo del Widget*/
    setMaxRange(max){ // max : Int
        this.ErrorThrow(["max", typeof min == "number" ? -1 : 10]);
        this.iMaxRange = max;
        this.jMapAttributes.MAXRANGE = this.iMaxRange;
    }

    /* Permite desabilitar el rango minimo del Widget */
    disableMinRange(){
        this.iMinRange = null;
        this.jMapAttributes.MINRANGE = "";
    }
    
    /* Permite desabilitar el rango máximo del Widget */
    disableMaxRange(){
        this.iMinRange = null;
        this.jMapAttributes.MINRANGE = "";
    }

}

/* Widget que permite visualizar una Entrada de Texto horizontal la cual tendrá el texto oculto con asterizcos*/
class InputPassword extends Input{
    constructor(entity, placeholder = ""){ // entity : JSON(master, id, class); placeholder : Strings
        super(entity, placeholder);
        
        this.sHtml = `<input id="IDNAME" class="input-password CLASSNAME" placeholder="PLACEHOLDERTEXT" type="password">`;
    }
}

/* Widget que permite visualizar un botón de opción circular*/
class RadioButton extends Widget{
    constructor(entity, check = false){ // entity : JSON(master, id, class); check : Bool
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

    /* Retorna el valor del chequeo del Widget */
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

/* Widget que permite visualizar un botón de opción en forma de casilla*/
class Checkbox extends Widget{
    constructor(entity, check = false){ // entity : JSON(master, id, class); check : Bool
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

/* Widget que permite visualizar una campo de texto en el cual se puede escribir */
class Text extends Widget{
    constructor(entity, width = 100, height = 100, text = "", placeholder = ""){ // entity : JSON(master, id, class); width : Int; height : Int; text : String; placeholder : Strings
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

    }

    setText(text){
        this.ErrorThrow(["text",(typeof text === "string") ? -1 : 2])
        this.sTextConcent = text;
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

/* Widget que permite visualizar una lista de opciones seleccionables */
class ListBox extends Widget{
    constructor(entity, rows = 2, width = 100, height = 100, list=[]){ // entity : JSON(master, id, class); rows : Int; width : Int; height : Int; list : Array(option)
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

    /* Añade un elmento a la lista de opciones del Widget*/
    addElement(elm){
        this.aElementList.push(elm);
    }  

    /* Añade una lista de elementos a la lista de opciones del Widget*/
    addElementsList(list = []){
        this.aElementList.concat(list);
    }
    
    /* Permite establiecer la lista de opciones del Widget*/
    setElementsList(list = []){
        this.aElementList = list;
        this.add();
    }
    
    /* Retorna la lista de opciones del Widget */
    getElements(){
        return this.aElementList;
    }

    /* Retorna una opción especifica de la lista de opciones del Widget */
    getIndexElement(index = 0){
        return this.aElementList[index];
    }
}

/* Widget que permite visualizar una lista desplegable de opciones */
class ComboBox extends ListBox{
    constructor(entity, width = 100, height = 100, list=[]){ // entity : JSON(master, id, class); width : Int; height : Int; list : Array(option)
        super(entity, 1, width, height, list);

        this.sHtml = `<select id="IDNAME" size="ROWS" class="combo-box CLASSNAME" style="width:WIDTHPX; height:HEIGHTPX;"></select>`;
        this.sTagInsert = `<select id="IDNAME" size="ROWS" class="combo-box CLASSNAME" style="width:WIDTHPX; height:HEIGHTPX;">`;
    }
}

/* Widget que permite dividir el espacio del DOM */
class Frame extends Widget{
    constructor(entity, width = -1, height = -1){ // entity : JSON(master, id, class); width : Int; height : -1
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

/* Widget que permite visualizar una barra de menú */
class Menu extends Widget{
    constructor(entity){ // entity : JSON(master, id, class);
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

/* Widget que permite visualizar un Menu dentro de la Barra de Menú */
class MenuSection extends Widget{
    constructor(entity, labelName = ""){ // entity : JSON(master, id, class); labelName : String
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

    /* Añade un item al Menú */
    addItem(labelName, command){ // labelName : String; command : Function
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

/* Widget que permite visualizar una ventana */
class TopWindow extends Widget{
    constructor(id, className = "", title = "TopWindow", width = 200, height = 200, posX = 100, posY = 100){ // id : String; className : String; title : String; width : Int; height : Int; posX : Int; posY : Int
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