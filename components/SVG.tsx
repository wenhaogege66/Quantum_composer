'use client';

import React, { useState } from 'react';
import { ListItem, ListItemText, Button, Dialog, DialogActions,DialogContent,DialogContentText,TextField, Typography } from '@mui/material';
import HG from '../img/Hadamard_Gate.svg';

interface ISvgImage {
    src: string;
    alt: string;
    style?: React.CSSProperties;
}

interface DraggableSVGProps {
    svgImage: ISvgImage;
    onGateSelect: () => void;
}

const DraggableSVG: React.FC<DraggableSVGProps> = ({ svgImage, onGateSelect }) => {

    return (
        <button
            onClick={onGateSelect}
            style={{
                cursor: 'pointer',
                margin: '10px',
                padding: 0,
                border: 'none',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...(svgImage.style || {}) // 允许外部传入的样式覆盖默认样式
            }}
        >
            <img src={svgImage.src} alt={svgImage.alt} style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </button>
    );
};

const ComponentPanel = ({ qubits, onAddGate }) => {

    const hadamardSvg: ISvgImage = {
        src: HG.src,
        alt: 'Hadamard Gate',
    };

    const [open, setOpen] = useState(false);
    const [selectedQubit, setSelectedQubit] = useState('');

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleQubitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedQubit(event.target.value);
    };

    const handleAddGate = () => {
        if (selectedQubit !== '') {
            onAddGate('H', parseInt(selectedQubit, 10));
        }
        handleClose();
    };

    const qubitOptions = Array.from({ length: qubits }, (_, index) => (
        <ListItem
            key={index}
            button
            value={String(index)}
            selected={selectedQubit === String(index)}
            onClick={() => setSelectedQubit(String(index))}
        >
            <ListItemText primary={`Qubit ${index}`} />
        </ListItem>
    ));


    return (
        <div>
            <DraggableSVG svgImage={hadamardSvg} onGateSelect={handleOpen} />
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogContent>
                    <DialogContentText id="form-dialog-title">
                        选择要添加 Hadamard 门的量子比特：
                    </DialogContentText>
                    <TextField
                        select
                        label="量子比特"
                        value={selectedQubit}
                        onChange={handleQubitChange}
                        helperText="请选择量子比特编号"
                        margin="normal"
                    >
                        {qubitOptions}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        取消
                    </Button>
                    <Button onClick={handleAddGate} color="primary">
                        添加
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ComponentPanel;