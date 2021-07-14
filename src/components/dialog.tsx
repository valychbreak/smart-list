import { Dialog as MaterialDialog, DialogProps } from "@material-ui/core";

const Dialog = ({ ...props } : DialogProps) => (props.open ? <MaterialDialog {...props}/> : <></>);

export default Dialog;
