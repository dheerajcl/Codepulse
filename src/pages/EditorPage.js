    import React, { useState, useRef, useEffect } from 'react';
    import toast from 'react-hot-toast';
    import ACTIONS from '../Actions';
    import Client from '../components/Client';
    import Editor from '../components/Editor';
    import { initSocket } from '../socket';
    import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
    import { SwipeableDrawer, IconButton } from '@mui/material';
    import MenuIcon from '@mui/icons-material/Menu';

    const EditorPage = () => {
        const socketRef = useRef(null);
        const codeRef = useRef(null);
        const location = useLocation();
        const { roomId } = useParams();
        const reactNavigator = useNavigate();
        const [clients, setClients] = useState([]);
        const [drawerOpen, setDrawerOpen] = useState(false);

        const toggleDrawer = (open) => (event) => {
            if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
                return;
            }

            setDrawerOpen(open);
        };

        useEffect(() => {
            const init = async () => {
                socketRef.current = await initSocket();

                socketRef.current.on('connect_error', (err) => handleErrors(err));
                socketRef.current.on('connect_failed', (err) => handleErrors(err));

                function handleErrors(e) {
                    console.log('socket error', e);
                    toast.error('Socket connection failed, try again later.');
                    reactNavigator('/');
                }

                socketRef.current.emit(ACTIONS.JOIN, {
                    roomId,
                    username: location.state?.username,
                });

                socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                        console.log(`${username} joined`);
                    }
                    setClients(clients);
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });
                });

                socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) => {
                        return prev.filter((client) => client.socketId !== socketId);
                    });
                });
            };
            init();
            return () => {
                socketRef.current.disconnect();
                socketRef.current.off(ACTIONS.JOINED);
                socketRef.current.off(ACTIONS.DISCONNECTED);
            };
        }, []);

        async function copyRoomId() {
            try {
                await navigator.clipboard.writeText(roomId);
                toast.success('Room ID has been copied to your clipboard');
            } catch (err) {
                toast.error('Could not copy the Room ID');
                console.error(err);
            }
        }

        function leaveRoom() {
            reactNavigator('/');
        }

        if (!location.state) {
            return <Navigate to="/" />;
        }

        return (
            <>
                <SwipeableDrawer
                    anchor="left"
                    open={drawerOpen}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}
                >
                    <div className="sidebar">
                        <div className="logo">
                            <img className="logo-image" src="/icon.png" alt="logo" />
                        </div>
                        <h3>Connected</h3>
                        <div className="clients-list">
                            {clients.map((client) => (
                                <Client key={client.socketId} username={client.username} />
                            ))}
                        </div>
                        <div className="button-container">
                            <button className="btn copy-btn" onClick={copyRoomId}>
                                Copy ROOM ID
                            </button>
                            <button className="btn leave-btn" onClick={leaveRoom}>
                                Leave
                            </button>
                        </div>
                    </div>
                </SwipeableDrawer>

                <div className="editor-page">
                    <div className="toggle-container">
                        <IconButton
                            color="inherit"
                            onClick={toggleDrawer(!drawerOpen)}
                            style={{ color: 'white' }} // Set arrow color to white
                        >
                            <MenuIcon />
                        </IconButton>
                    </div>
                    <div className="editor-wrap">
                        <Editor
                            socketRef={socketRef}
                            roomId={roomId}
                            onCodeChange={(code) => {
                                codeRef.current = code;
                            }}
                        />
                    </div>
                </div>
            </>
        );
    };

    export default EditorPage;
