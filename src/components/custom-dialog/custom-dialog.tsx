import React from 'react'
import remove from '../icons/remove.jfif';

interface CustomDialogProps {
    open: boolean;
    handleClose(): void;
}

const CustomDialog: React.FC<CustomDialogProps> = (props) => {
    return (<>
        {props.open && 
            <div className="center">
                <div className="container">
                        <label htmlFor="show" className="close-btn fas fa-times" title="close">
                            <img src={remove} onClick={() => props.handleClose()} alt="remove" className="icons" />
                        </label>
                        {props.children}
                </div>
            </div>
        }
    </>)
}

export default CustomDialog;