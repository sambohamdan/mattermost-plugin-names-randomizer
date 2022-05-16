// eslint-disable-next-line max-lines
import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';

import {fetchCurrentUsers, getCurrentChannelName, observeUrlChange} from '../../helpers';
import {
    addToLocalStorage,
    STORAGE_ENTRY,
    isMainEntryDefined,
    getFromLocalStorage,
    resetSpecificEntryInLocalStorage,
} from '../../storage';

const Modal = ({visible, close}) => {
    if (!visible) {
        return null;
    }
    const MAIN_CHANNEL_INPUT_FIELD = 'post_textbox';
    const MAIN_HEADER_RANDOMIZER_BTN = 'randomizer-icon';
    const mainInputField = document.querySelectorAll(`#${MAIN_CHANNEL_INPUT_FIELD}`)[0];
    const randomizerTrigger = document.querySelectorAll(`#${MAIN_HEADER_RANDOMIZER_BTN}`)[0];
    const [enteredName, setEnteredName] = useState('');
    const [list, setList] = useState([]);
    const listWrapper = useRef(null);
    const [showEditMode, setShowEditMode] = useState(false);
    const [editModeChecked, setEditModeChecked] = useState(false);
    const [resetModeChecked, setResetModeChecked] = useState(false);
    observeUrlChange(randomizerTrigger.parentElement);

    useEffect(() => {
        // pre-render saved names
        if (isMainEntryDefined()) {
            if (Object.keys(JSON.parse(localStorage.getItem(STORAGE_ENTRY))).includes(getCurrentChannelName())) {
                if (getFromLocalStorage(STORAGE_ENTRY, getCurrentChannelName()).length > 0) {
                    setList(getFromLocalStorage(STORAGE_ENTRY, getCurrentChannelName()));
                }
            }
        }
    }, []);

    const closeHandler = (e) => {
        if (e.target.classList.contains('modal-wrapper') || e.target.classList.contains('close')) {
            close();
        }
    };
    const handleChange = (e) => {
        if (e.target.value) {
            setEnteredName(e.target.value);
        }
    };
    const handleRenderer = () => {
        setList([...list, enteredName]);
        addToLocalStorage(STORAGE_ENTRY, getCurrentChannelName(), enteredName);
        setEnteredName('');
    };
    const handleEnterKey = (e) => {
        if (e.key === 'Enter') {
            handleRenderer();
        }
    };
    const handleShuffle = () => {
        setList(list.map((name) => ({name, sort: Math.random()})).sort((a, b) => a.sort - b.sort).map(({name}) => name));
    };
    const handleEditMode = (e) => {
        if (e.target.checked) {
            mainInputField.setAttribute('disabled', true);
        } else {
            mainInputField.removeAttribute('disabled');
        }
        setEditModeChecked(e.target.checked);
        setShowEditMode(e.target.checked);
    };
    const handleFetchNames = (e) => {
        setResetModeChecked(e.target.checked);
        if (e.target.checked) {
            fetchCurrentUsers().then((data) => {
                setList([]);
                data.forEach((item) => {
                    addToLocalStorage(STORAGE_ENTRY, getCurrentChannelName(), item.first_name + item.last_name);
                    setList([...list, item.first_name + ' ' + item.last_name]);
                });
            });
        }
    };
    const handleSubmit = () => {
        const changedList = listWrapper.current.children;
        resetSpecificEntryInLocalStorage(STORAGE_ENTRY, getCurrentChannelName());
        setList([]);
        const tempList = [];
        for (const item of changedList) {
            addToLocalStorage(STORAGE_ENTRY, getCurrentChannelName(), item.innerText);
            tempList.push(item.innerText);
        }
        setList(tempList);
        setEditModeChecked(false);
        setShowEditMode(false);
        mainInputField.removeAttribute('disabled');
    };
    const handleReset = () => {
        setList([]);
        resetSpecificEntryInLocalStorage(STORAGE_ENTRY, getCurrentChannelName());
        setResetModeChecked(false);
    };

    return (
        <div
            onClick={closeHandler}
            className='modal-wrapper modal-randomizer'
            id='randomizer'
        >
            <style>{modalStyleContent}</style>
            <div
                className='modal-content'
            >
                <span
                    className='close'
                    onClick={closeHandler}
                >
                    {'x'}
                </span>
                <h3 className='headline'>{'Names Randomizer'}</h3>
                <div className='form'>
                    <label>{'Please insert a name'}</label>
                    <input
                        name='name'
                        id='name'
                        onChange={handleChange}
                        onKeyDown={handleEnterKey}
                        value={enteredName}
                        autoFocus={true}
                    />
                    <button
                        id='add'
                        onClick={handleRenderer}
                    >{'Add'}</button>
                    <div className='toggles-wrapper'>
                        <div className='toggle-wrapper'>
                            <label htmlFor='toggle-fetch-names'>{'Get current channel\'s users ?'}</label>
                            <div className='toggle r'>
                                <input
                                    type='checkbox'
                                    id='toggle-fetch-names'
                                    className='toggler toggle-fetch-names'
                                    onClick={handleFetchNames}
                                    checked={resetModeChecked}
                                />
                                <div className='knobs'/>
                                <div className='layer'/>
                            </div>
                        </div>
                        <div className='toggle-wrapper active-edit-mode-wrapper'>
                            <label
                                htmlFor='active-edit-mode'
                            >
                                {'Active Edit Mode ?'}
                            </label>
                            <div className='toggle r'>
                                <input
                                    type='checkbox'
                                    id='active-edit-mode'
                                    className='toggler active-edit-mode'
                                    onClick={handleEditMode}
                                    disabled={list.length <= 0}
                                    checked={editModeChecked}
                                />
                                <div className={`knobs ${list.length <= 0 && 'is-disabled-edit-btn'}`}/>
                                <div className='layer'/>
                            </div>
                        </div>
                    </div>
                </div>
                <span className={`edit-mode-background ${!showEditMode && 'is-hidden'}`}/>
                <ol
                    className='saved-names'
                    ref={listWrapper}
                    contentEditable={showEditMode && 'true'}
                >
                    {list.map((item, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <li key={index}>{item}</li>
                    ))}
                </ol>
                <button
                    id='shuffle-btn'
                    disabled={list.length <= 1}
                    onClick={handleShuffle}
                >
                    {'Shuffle'}
                </button>
                <button
                    className={`reset-selections ${list.length <= 0 && 'is-hidden'}`}
                    id='reset-selections'
                    onClick={handleReset}
                >
                    {'Reset'}
                </button>
                <button
                    className={`finish-edit-mode ${!showEditMode && 'is-hidden'}`}
                    id='finish-edit-mode'
                    onClick={handleSubmit}
                >
                    {'Save Changes'}
                </button>
                <a
                    className='designer-link'
                    href='https://sambohamdan.github.io/'
                    target='_blank'
                    rel='noopener noreferrer'
                >{'Designer'}</a>
            </div>
        </div>
    );
};

Modal.propTypes = {
    visible: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
};

// @todo: import styles as css module using Webpack.
const modalStyleContent = `@keyframes animateIn {
    0% {
        opacity: 0;
        transform: scale(0.6) translateY(-8px);
    }
    100% {
        opacity: 1;
    }
}

#mattermost-name-randomizer {
    padding: 0 4px;
}

#randomizer button {
    transition: background .2s ease-in-out;
    cursor: pointer;
    padding: 0.5rem 1rem;
    background-color: #1e325c;
    color: #fff;
    border-width: 1px;
}

#randomizer button#add {
    color: #fff;
    border-radius: 100px;
    font-size: 14px;
    background-color: #3da050;
    border: 0;
    margin-left: 4px;
}

#randomizer button#add:hover {
    background-color: #3db887;
}

#randomizer .form input#name {
    color: #000;
    padding: 6px 8px;
    border-radius: 5px;
    border: 1px solid #000;
}

#randomizer .form input#name:active {
    outline: 0;
}

.is-hidden {
    display: none;
}

.is-displayed {
    display: block;
}

.modal-randomizer #shuffle-btn {
    color: #000;
    background: #fff;
    margin-right: 8px;
}

.modal-randomizer #shuffle-btn:hover {
    background-color: #3da050;
    color: #fff;
}

.modal-randomizer #shuffle-btn[disabled] {
    background: grey;
    cursor: no-drop;
}

.modal-randomizer #reset-selections {
    background-color: #d24b4e;
}

.modal-randomizer h3.headline {
    text-align: center;
}

.modal-randomizer .form {
    padding-top: 32px;
}

.modal-randomizer .form label {
    display: block;
}

.modal-randomizer .saved-names li {
    animation-name: animateIn;
    animation-duration: 250ms;
    animation-delay: calc(var(--animation-order) * 50ms);
    animation-fill-mode: both;
    animation-timing-function: ease-in-out;
}

.modal-randomizer .saved-names li::-moz-selection {
    background: red;
}

.modal-randomizer .saved-names li::selection {
    background: red;
}

.modal-randomizer .saved-names {
    caret-color: red;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    max-height: 50vh;
    font-size: 16px;
    padding: 32px 16px;
}

.modal-randomizer {
    position: fixed;
    z-index: 50;
    padding-top: 100px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 2000;
}

.modal-randomizer .modal-content {
    color: #fff;
    background: linear-gradient(170deg, rgba(49, 57, 73, 0.8) 20%, rgba(49, 57, 73, 0.5) 20%, rgba(49, 57, 73, 0.5) 35%, rgba(41, 48, 61, 0.6) 35%, rgba(41, 48, 61, 0.8) 45%, rgba(31, 36, 46, 0.5) 45%, rgba(31, 36, 46, 0.8) 75%, rgba(49, 57, 73, 0.5) 75%), linear-gradient(45deg, rgba(20, 24, 31, 0.8) 0%, rgba(41, 48, 61, 0.8) 50%, rgba(82, 95, 122, 0.8) 50%, rgba(133, 146, 173, 0.8) 100%) #313949;
    margin: auto;
    padding: 20px;
    border: 1px solid #1E325C;
    width: 60%;
}

.modal-randomizer #reset-selections:hover {
    background: #d21a00;
}

.modal-randomizer .close {
    color: #fff;
    float: right;
    font-size: 21px;
    font-weight: bold;
    opacity: .8;
}

.modal-randomizer .close:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
}

#randomizer.start-selections {
    position: absolute;
    height: unset;
    width: unset;
    background-color: unset;
    top: 100px;
    left: 60%;
    transform: translateX(-50%);
    z-index: 50;
    padding-top: 16px;
}

.modal-randomizer .finish-selections {
    display: none;
}

.modal-randomizer .start-selections h3.start-selections, .modal-randomizer .start-selections button#start-selections {
    display: none;
}

.modal-randomizer .start-selections .finish-selections {
    display: block;
}

.knobs, .layer {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

.toggles-wrapper {
    margin-top: 16px;
    display: flex;
    justify-content: space-evenly;
}

.toggle-wrapper.active-edit-mode-wrapper {
    z-index: 10;
}

.toggle-wrapper {
    margin-top: 16px;
}

.toggle {
    position: relative;
    width: 70px;
    height: 25px;
    overflow: hidden;
}

.toggle.r, .toggle.r .layer {
    z-index: 0;
    border-radius: 100px;
}

.toggle.b2 {
    border-radius: 2px;
}

.toggler {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    opacity: 0;
    cursor: pointer;
    z-index: 3;
}

.knobs {
    z-index: 2;
}
.knobs.is-disabled-edit-btn {
    background: gray;
}

.layer {
    width: 100%;
    background-color: #ebf7fc;
    transition: 0.3s ease all;
    z-index: 1;
}

.toggle .knobs.is-disabled-edit-btn:before {
    background: #000;
}

.toggle .knobs:before {
    content: 'NO';
    position: absolute;
    top: 4px;
    left: 4px;
    width: 23px;
    height: 18px;
    color: #fff;
    font-size: 10px;
    font-weight: bold;
    text-align: center;
    line-height: 1;
    padding: 4px 0;
    background-color: #F44336;
    border-radius: 50%;
    transition: 0.3s ease all, left 0.3s cubic-bezier(.18, .89, .35, 1.15);
}

.toggle .toggler:active + .knobs:before {
    width: 46px;
    border-radius: 100px;
}

.toggle .toggler:checked:active + .knobs:before {
    margin-left: -26px;
}

.toggle .toggler:checked + .knobs:before {
    content: 'YES';
    left: 42px;
    background-color: #03A9F4;
}

.toggle .toggler:checked ~ .layer {
    background-color: #fcebeb;
}

.edit-mode-background {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.6);
}

button#finish-edit-mode:hover {
    background-color: #3da050;
    color: #fff;
}

button#finish-edit-mode {
    isolation: isolate;
    z-index: 5;
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    color: #000;
}

a.designer-link {
    position: absolute;
    right: 20px;
    bottom: 18px;
    color: #fff;
    text-shadow: 0 1px 2px #75b663, 1px 3px 1px #5ea04b, 2px 5px 1px #5b9c49;
}
a.designer-link:hover {
    text-decoration: none;
    color: #fff;
}
`;

export default Modal;
