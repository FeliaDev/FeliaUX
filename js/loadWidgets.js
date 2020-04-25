const frmMainFrame = new Frame({"master":"MainHeader", "id":"MyFrame", "class":""})
const lblLabel = new Label({"master":frmMainFrame.getId(), "id":"MyLabel", "class":""}, "Label");
const inpInput = new Input({"master":frmMainFrame.getId(), "id":"MyInput", "class":""}, "I'm an Input");
const btnButton = new Button({"master":frmMainFrame.getId(), "id":"MyButton", "class":""}, "Button", ()=>{console.log(inpInput.getContent())});
const rdbRadioButton = new RadioButton({"master":frmMainFrame.getId(), "id":"MyRadioButton", "class":""});
const chkCheckbox = new Checkbox({"master":frmMainFrame.getId(), "id":"MyCheckbox","class":""})
const txtTextarea = new Text({"master":frmMainFrame.getId(), "id":"MyText", "class":""}, 200, 200, "Hello I'm a Text Area.")
const lstListbox = new ListBox({"master":frmMainFrame.getId(), "id":"MyListbox", "class":""}, 3, 200, 45);
const cmbComboBox = new ComboBox({"master":frmMainFrame.getId(), "id":"MyComboBox", "class":""}, 200, 20);
const inumInputNumber = new InputNumber({"master":frmMainFrame.getId(), "id":"MyInputNum", "class":""});
const pswInputPsw = new InputPassword({"master":frmMainFrame.getId(), "id":"MyInputPass", "class":""});
const winTopWin = new TopWindow("MyWindow", "", "I'm a Top Window", 200, 200, 100, 100)

const lblLabelTopWin = new Label({"master":winTopWin.getId(), "id":"MyLabelIntoWin", "class":""}, "I'm a Label living in TopWindow")

const mbrMenuBar = new Menu({"master":"MainHeader", "id":"MyMenuBar", "class":""});
const mbtnFileMenu = new MenuSection({"master":mbrMenuBar.getId(), "id":"MyFileMenu", "class":""}, "File");
const mbtnEditMenu = new MenuSection({"master":mbrMenuBar.getId(), "id":"MyEditMenu", "class":""}, "Edit");

mbtnFileMenu.addItem("New File", ()=>{console.log("new file clicked")});
mbtnFileMenu.addItem("Open File", ()=>{console.log("open file clicked")});
mbtnFileMenu.addItem("Save File", ()=>{console.log("Save file clicked")});
mbtnFileMenu.addItem("Save As File", ()=>{console.log("Save As file clicked")});
mbtnFileMenu.addItem("Exit", ()=>{console.log("exit clicked")});
mbtnFileMenu.addItem("Exita", ()=>{console.log("exit clicked")});

mbtnEditMenu.addItem("Undo", ()=>{console.log("undo clicked")})
mbtnEditMenu.addItem("Redo", ()=>{console.log("redo clicked")})

let aElementsList = ["I", "am", "a", "Listbox"];
let aElementsCombo = ["I", "am", "a", "ComboBox"];

lblLabel.setText("I'm a Label");
btnButton.setText("I'm a Button");
lstListbox.setElementsList(aElementsList);
cmbComboBox.setElementsList(aElementsCombo);
inumInputNumber.setMinRange(0);


mbrMenuBar.pack();
mbtnFileMenu.pack();
mbtnEditMenu.pack();
frmMainFrame.pack();
lblLabel.pack();
btnButton.pack();
inpInput.pack();
rdbRadioButton.pack();
chkCheckbox.pack();
txtTextarea.pack();
lstListbox.pack();
cmbComboBox.pack();
inumInputNumber.pack();
pswInputPsw.pack();

winTopWin.pack();

lblLabelTopWin.pack()