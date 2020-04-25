const mbMenu = new Menu({"master":"ParentBody", "id":"MainMenuBar", "class":""});

const msMenuFile = new MenuSection({"master":mbMenu.getId(), "id":"FileMenu", "class":""}, "File");
const msMenuEdit = new MenuSection({"master":mbMenu.getId(), "id":"FileEdit", "class":""}, "Edit");
const msMenuHelp = new MenuSection({"master":mbMenu.getId(), "id":"FileHelp", "class":""}, "Help");


function newFile(){
    txtTextBox.pack()
}

function openFile(){
    
    function openFileDialog () {  // this function must be called from  a user
        // activation event (ie an onclick event)
        console.log("Hola")

        // Create an input element
        var inputElement = document.createElement("input");

        // Set its type to file
        inputElement.type = "file";

        // dispatch a click event to open the file dialog
        inputElement.dispatchEvent(new MouseEvent("click")); 
    }
    let winAskForFile = new TopWindow("askForFile", "", "Open File from Desktop", 300, 100, 300, 300);
    let inpPath = new Input({"master": winAskForFile.getId(), "id":"InpPath", "class":""});
    let btnOpenFromDesktop = new Button({"master": winAskForFile.getId(), "id":"BtnOpenFile", "class":""}, "Browse", openFileDialog);
    winAskForFile.pack();
    inpPath.pack();
    btnOpenFromDesktop.pack();
}

msMenuFile.addItem("New File", newFile);
msMenuFile.addItem("Open File", openFile);
msMenuFile.addItem("Save",()=>{say("Save")});
msMenuFile.addItem("Save As",()=>{say("Save As")});
msMenuFile.addItem("Exit",()=>{say("Exit")});

msMenuEdit.addItem("Redo",()=>{});
msMenuEdit.addItem("Undo",()=>{});
msMenuEdit.addItem("Cut",()=>{});
msMenuEdit.addItem("Copy",()=>{});
msMenuEdit.addItem("Paste",()=>{});

msMenuHelp.addItem("Welcome",()=>{});
msMenuHelp.addItem("Docs",()=>{});
msMenuHelp.addItem("Tutorial",()=>{});
msMenuHelp.addItem("About",()=>{});
msMenuHelp.addItem("Credits",()=>{});

const frmMainFrame = new Frame({"master":"ParentBody", "id":"MainFrame", "class":""}, 1350, 655-38);
const txtTextBox = new Text({"master": frmMainFrame.getId(), "id":"MainTextBox", "class":""});


mbMenu.pack();
msMenuFile.pack();
msMenuEdit.pack();
msMenuHelp.pack();

frmMainFrame.pack();