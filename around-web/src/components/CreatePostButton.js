import React from 'react';
import { Modal, Button, message } from 'antd';
import { CreatePostForm } from './CreatePostForm';
import { API_ROOT, AUTH_HEADER, TOKEN_KEY, POS_KEY, LOC_SHAKE } from '../constants';

export class CreatePostButton extends React.Component {
    state = {
        visible: false,
        confirmLoading: false,
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                    confirmLoading: true,
                });

                console.log('values', values);
                // TODO:
                // 1. Fire API
                //    1.1 Success:
                //          1.1.1 Reset Form
                //          1.1.2 Show message
                //          1.1.3 Close modal
                //          1.1.4 Update image post gallery
                //    1.2 Failed:
                //          1.2.1 Re-enable 'create' button
                //          1.2.2 Display error message

                /**
                 * Math.random()  : (0, 1)
                 * Offset range   : (-LOC_SHAKE, LOC_SHAKE)
                 *
                 * value => value + offset
                 *
                 * let offset = LOC_SHAKE - Math.random() * 2 * LOC_SHAKE
                 */

                const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
                const token = localStorage.getItem(TOKEN_KEY);
                const formData = new FormData();
                formData.set('lat', lat + LOC_SHAKE - Math.random() * 2 * LOC_SHAKE)
                formData.set('lon', lon + LOC_SHAKE - Math.random() * 2 * LOC_SHAKE);
                formData.set('message', values.message);
                formData.set('image', values.image[0].originFileObj);

                fetch(`${API_ROOT}/post`, {
                    method: 'POST',
                    headers: {
                        Authorization: `${AUTH_HEADER} ${token}`
                    },
                    body: formData
                })
                    .then(
                        (response) => {
                            if (response.ok) {
                                this.form.resetFields();
                                message.success("Post created successfully.");

                                this.setState({
                                    visible: false,
                                    confirmLoading: false
                                });

                                this.props.loadNearbyPosts();
                                return;
                            }
                            throw new Error(response.statusText);
                        }
                    )
                    .catch(
                        (err) => {
                            message.error('Fail to create post');
                            this.setState({
                                confirmLoading: false
                            });
                        }
                    )
            }
        });
    };

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    };

    getFormRef = (formInstance) => {
        this.form = formInstance;
        console.log(formInstance);
    }

    render() {
        const { visible, confirmLoading } = this.state;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>
                    Create New Post
                </Button>
                <Modal
                    title="Create New Post"
                    visible={visible}
                    onOk={this.handleOk}
                    okText="Create"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <CreatePostForm ref={this.getFormRef} />
                </Modal>
            </div>
        );
    }
}
