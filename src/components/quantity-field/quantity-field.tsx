import { useEffect, useState } from "react";

type QuantityFieldProps = {
    defaultQuantity: number;
    onChange(newQuantity: number): void;
};

const QuantityField = (props: QuantityFieldProps) => {
    const [itemQuantity, setItemQuantity] = useState<string>("");

    // Using useEffect in order to change displayed value when default is changed
    useEffect(() => {
        setItemQuantity(props.defaultQuantity.toString());
    }, [props.defaultQuantity]);

    const increaseQuantity = () => {
        const quantity = parseInt(itemQuantity);
        changeItemQuantity(quantity + 1);
    };

    const decreaseQuantity = () => {
        const quantity = parseInt(itemQuantity);
        if (quantity > 1) {
            changeItemQuantity(quantity - 1);
        }
    };

    const onManualInput = (e: any) => {
        const inputValue = e.target.value as string;
        setItemQuantity(inputValue);

        const quantity = parseInt(inputValue);
        if (quantity > 0) {
            changeItemQuantity(quantity);
        }
    };

    const changeItemQuantity = (quantity: number) => {
        setItemQuantity(quantity.toString());
        if (props.onChange) {
            props.onChange(quantity);
        }
    };

    const restoreDefaultQuantity = () => {
        const defaultValue = props.defaultQuantity.toString();
        if (itemQuantity !== defaultValue) {
            setItemQuantity(defaultValue);
        }
    };

    return (
        <div className="quantity-input">
            <button type="button"
                className="quantity-input__modifier quantity-input__modifier--left"
                onClick={decreaseQuantity}
            >
                &mdash;
            </button>
            <input
                className="quantity-input__screen"
                type="text"
                onChange={onManualInput}
                onBlur={restoreDefaultQuantity}
                value={itemQuantity}
            />
            <button type="button"
                className="quantity-input__modifier quantity-input__modifier--right"
                onClick={increaseQuantity}
            >
                &#xff0b;
            </button>
        </div>
    );
};

export default QuantityField;
