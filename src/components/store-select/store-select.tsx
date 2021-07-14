import { InputBase, withStyles } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import React from "react";
import { Store } from "../todo-item-list/types";

const BootstrapInput = withStyles(() => ({}))(InputBase);

type StoreSelectProps = {
    selectedStore: Store | null;
    storeList: Store[];
    onStoreSelect: (store: Store | null) => void;
};

const StoreSelect = (props: StoreSelectProps) => {
    const { selectedStore, storeList } = props;

    const onStoreChange = (event: any) => {
        const value = event.target.value as string;
        const store = storeList.find((existingStore) => existingStore.name === value);
        props.onStoreSelect(store || null);
    };

    return (
        <Select
            onChange={onStoreChange}
            value={selectedStore ? selectedStore.name : "None"}
            input={<BootstrapInput />}
        >
            <MenuItem value="None">
                None
            </MenuItem>
            {storeList.map((store) => (
                <MenuItem key={store.id} value={store.name}>
                    {store.name}
                </MenuItem>
            ))}
        </Select>
    );
};

export default StoreSelect;
