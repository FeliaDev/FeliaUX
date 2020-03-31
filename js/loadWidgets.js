const lblLabel = new Label({"master":"MainHeader", "id":"MyLabel", "class":""}, "Label");
const inpInput = new Input({"master":"MainHeader", "id":"MyInput", "class":""}, "I'm an Input");
const btnButton = new Button({"master":"MainHeader", "id":"MyButton", "class":""}, "Button", ()=>{console.log(GetInputValue(inpInput))});
const rdbRadioButton = new RadioButton({"master":"MainHeader", "id":"MyRadioButton", "class":""});

lblLabel.setText("I'm a Label");
btnButton.setText("I'm a Button");

lblLabel.pack();
btnButton.pack();
inpInput.pack();
rdbRadioButton.pack();

