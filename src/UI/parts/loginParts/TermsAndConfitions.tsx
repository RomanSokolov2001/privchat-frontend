import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import {setTermsAccepted} from "../../../redux/messengerSlice";
import Checkbox from "../../inputs/checkbox/Checkbox";
import {Link} from "react-router-dom";
import React from "react";

const TermsAndConditions = () => {
    const dispatch = useDispatch();
    const areTermsAccepted = useSelector((state: RootState) => state.messenger.areTermsAccepted);

    function onClick() {
        dispatch(setTermsAccepted(!areTermsAccepted));
    }
    return (
        <div className="flex flex-row items-center gap-5 pt-4">
            <Checkbox state={areTermsAccepted} setState={onClick} />
            <div>
                <a>I have read and understand </a>
                <Link to="/termofuse" className="text-blue-500 underline hover:text-blue-700">
                    Terms of Use
                </Link>
            </div>
        </div>
    );
};

export default TermsAndConditions;
