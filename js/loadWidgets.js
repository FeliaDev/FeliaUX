const lblLabel = new Label({"master":"MainHeader", "id":"MyLabel", "class":""}, "Label");
const inpInput = new Input({"master":"MainHeader", "id":"MyInput", "class":""}, "I'm an Input");
const btnButton = new Button({"master":"MainHeader", "id":"MyButton", "class":""}, "Button", ()=>{console.log(GetInputValue(inpInput))});
const rdbRadioButton = new RadioButton({"master":"MainHeader", "id":"MyRadioButton", "class":""});
const chkCheckbox = new Checkbox({"master":"MainHeader", "id":"MyCheckbox","class":""})
const txtTextarea = new Text({"master":"MainHeader", "id":"MyText", "class":""}, 200, 200, "Hello I'm a Text Area.")
const lstListbox = new ListBox({"master":"MainHeader", "id":"MyListbox", "class":""}, 3, 200, 45);

let asElements = ["I", "am", "a", "Listbox"];

lblLabel.setText("I'm a Label");
btnButton.setText("I'm a Button");
lstListbox.setElementsList(asElements);


lblLabel.pack();
btnButton.pack();
inpInput.pack();
rdbRadioButton.pack();
chkCheckbox.pack();
txtTextarea.pack();
lstListbox.pack();