import React from 'react'
import { Container, Row, Col } from 'reactstrap';
import './HomePageComponent.css'
import NewCarFormComponent from './NewCarFormComponent/NewCarFormComponent';
import { useHttpClient } from '../hooks/useHttpClient'
import { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import moment from 'moment';
import { Alert } from 'reactstrap';



import QrComponent from './QrComponent/QrComponent'


function HomePageComponent(props) {

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);


    const [PostedCar, setPostedCar] = useState(null);
    const [ScannedQr, setScannedQr] = useState(null);
    const [UpdatedCar, setUpdatedCar] = useState(null);


    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const submit_form = async (fields) => {
        console.log({ new_maintainance_date: moment(Date.now()).format('DD/MM/YYYY') })
        try {
            const responseData = await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/cars/${PostedCar.data[0]._id}`, 'PUT',
                JSON.stringify({ new_maintainance_date: moment(Date.now()).format('MM/DD/YYYY') }),
                { "Content-Type": "application/json" }
            );
            console.log('responseData ', responseData)
            setUpdatedCar(true)


        } catch (err) {
            console.log({ err })
        }
    }


    useEffect(() => {
        console.log(ScannedQr)
    }, [ScannedQr])

    const onCancel = () => {
        setPostedCar(null)
        setScannedQr(null)
        setUpdatedCar(null)
    }


    return (

        <>
            <div style={{}}>
                <div>
                    {ScannedQr === PostedCar?.data[0].qr_str ?
                        <Container className='update_maint_date_container'>
                            <div>  <Button style={{ height: "130px", width: "80%", fontSize: "35px", marginTop: '20px' }} color="primary" onClick={submit_form}>update maintainance date</Button>{' '}</div>
                            <Button style={{ height: "50px", width: "80%", marginTop: "20px" }} color="danger" onClick={onCancel}>Go Back</Button>
                            {UpdatedCar &&
                                <Alert color="success" style={{ marginTop: '20px' }}>
                                    Maintainance Date Updated
                                </Alert>
                            }
                        </Container>
                        :
                        <Container className='Form_container' style={{ marginTop: '0px' }}>

                            <Row>

                                <Col xs="12" md="4">
                                    <div className='page_title' > Maintainance</div>
                                    <div className='page_sub_title' > Enter car's plate info then scan the QR code to update the car's maintaince date</div>

                                    <NewCarFormComponent setPostedCar={setPostedCar} />
                                </Col>

                                <Col xs="12" md="7">
                                    <div>
                                        {PostedCar &&
                                            <>
                                                <div style={{ width: '90%', marginTop: "30px", margin: '30px auto 30px auto' }}>
                                                    <button className='scan_qr_button' style={{ width: '100%' }} color="success" onClick={toggle}>
                                                        <div style={{ marginLeft: '10px' }}> SCAN QR CODE</div>
                                                        <img style={{ marginRight: '10px', height: '50px' }} src='/qr_logo.png' alt='qr' />
                                                    </button>
                                                </div>
                                                <Modal isOpen={modal} toggle={toggle}>
                                                    <ModalHeader toggle={toggle}>Scan Code</ModalHeader>
                                                    <ModalBody>
                                                        {!toggle ? <div>test</div> :
                                                            <QrComponent setScannedQr={setScannedQr} />
                                                        }
                                                    </ModalBody>
                                                    <ModalFooter>
                                                        <Button color="danger" onClick={toggle}>Cancel</Button>
                                                    </ModalFooter>
                                                </Modal>
                                            </>
                                        }
                                    </div>
                                </Col>
                            </Row>

                        </Container>
                    }
                </div>



            </div >
        </>
    )
}

export default HomePageComponent
