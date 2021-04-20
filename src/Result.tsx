import React from "react";

const Result: React.FC<any> = (props: any) => {
    const { result } = props;

    if (!result) {
        return null;
    }
    return (
        <li >
            {result.codeResult.code} [{result.codeResult.format}]
        </li>
    );
};

export default Result;
