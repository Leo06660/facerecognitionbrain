import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({onInputChange, onButtonSubmit}) => {
    return (
        <div>
            <p className='f3'>
                {'This Magic Brain will detect faces. Give it a shot...'}
            </p>
            <div className='center'>
                <div className='center form pa4 br3 shadow-5'>
                    <input 
                        className='f4 pa2 w-70 center' 
                        type='text' 
                        onChange={onInputChange}
                        // value='Paste your image link here'
                    />
                    <button 
                        className='w-30 grow f5 link ph3 pv2 dib white bg-light-blue'
                        onClick={onButtonSubmit}
                    >
                        Detect
                    </button>
                </div>
                
            </div>
        </div>
    );
}

export default ImageLinkForm;

