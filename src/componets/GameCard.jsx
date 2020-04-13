import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Col from "react-bootstrap/Col";
import Collapse from 'react-bootstrap/Collapse'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import '../index.css';


function GameCard(props) {
    const [open, setOpen] = useState(false);
    return(
        <Col md={12} lg={12} className="p-0 mb-4">
            <div className="position-relative" onClick={() => setOpen(!open)}>
                <img className="w-100 h-auto gameCard" alt={props.name} src={props.image} />
                <div className="middleTop">
                    <div className="text">{props.name}</div>
                </div>
                <div className="middleBottom">
                    <div className="text underline">More Info</div>
                    <div className="text"><FontAwesomeIcon icon={faCaretDown} /></div>
                </div>
            </div>
            <Collapse in={open}>
                <div className="gameInfo">
                <p className="pl-3 pt-2 pb-3">
                    {props.info.shortdesc}
                    <br />
                    Genre: {props.info.genre}
                    <br />
                    Multiplayer: {props.info.multiplayer}
                    <br />
                    {props.info.tags.map(function(tag){
                        return <Button className={"steamTags"} key={tag}>{tag}</Button>
                    })}
                    <br />
                    <a href={props.info.storelink}>Store Link</a>
                </p>
                </div>
            </Collapse>
        </Col>
    )
}

export default GameCard