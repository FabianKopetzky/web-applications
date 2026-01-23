import {useTranslation} from "react-i18next";
import {useNavigate, useParams} from "react-router-dom"

import {HouseHoldTask} from "../../models/HouseHoldModel";
import ChoreInput from "../../components/ChoreInput";
import {useState, useEffect, useRef} from "react";
import ChoreItem from "../../components/ChoreItem";
import api from "../../services/api";
import UserModel from "../../models/UserModel";
import AddPeopleInput from "../../components/HouseholdUsers";
import {Alert, Button, Space, Table, notification, Row, Col, Card, Tooltip, Tag, Popconfirm} from "antd";
import {EditOutlined, ArrowLeftOutlined, DeleteOutlined, CheckOutlined} from '@ant-design/icons';
import EditableCell from "../../components/EditableCell";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";


function HouseHold() {

    const HOUSEHOLD_API = '/household';
    const AUTH_API = '/getUser';
    const USER_API = '/user';

    const navigate = useNavigate();

    const {id} = useParams();
    const {t} = useTranslation();

    // const [originalChores, setOriginalChores] = useState([]);

    const [householdChores, setHouseholdChores] = useState([]);
    const [user, setUser] = useState(null);
    const [userModel, setUserModel] = useState(null);
    const [houseHold, setHousehold] = useState(null);
    const [householdUsers, setHouseholdUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [changesMade, setChangesMade] = useState(false);

    const [editingHouseholdName, setEditingHouseholdName] = useState(false);
    const [householdName, setHouseholdName] = useState("");
    const [newHouseholdName, setNewHouseholdName] = useState("");
    const houseHoldNameInput = useRef(null);
    const [editing, setEditing] = useState({key: null, field: null});
    const [notificationHandled, setNotificationHandled] = useState(false);

    const [expandedRows, setExpandedRows] = useState({}); // { [taskKey]: true/false }


    const latestTasksRef = useRef(householdChores);

    useEffect(() => {
        latestTasksRef.current = householdChores;
    }, [householdChores]);



    const toggleExpanded = (key) => {
        setExpandedRows(prev => ({ ...prev, [key]: !prev[key] }));
    };



    async function reloadData() {
        setLoading(true);
        await loadData();
        // setLoading(false); // if an error happens, the page should not show
    }

    async function loadData() {

        // USER
        try {
            console.log("Token:", localStorage.getItem('accessToken'));

            const accessToken = localStorage.getItem("accessToken");
            const response = await api.get(AUTH_API, {
                headers: {Authorization: `Bearer ${accessToken}`}
            });
            console.log("Response:");
            console.log(response);
            console.log("Data:");
            console.log(response.data);

            setUser(response.data);
            setUserModel(new UserModel(response.data._id, response.data.first_name, response.data.last_name, response.data.permissions));
        } catch (err) {
            console.log(err);
        }

        // HOUSEHOLD
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await api.get(`${HOUSEHOLD_API}/${id}`, {
                headers: {Authorization: `Bearer ${accessToken}`}
            });
            console.log(response.data);
            setHousehold(response.data);

            setHouseholdChores(response.data.tasks);
            setHouseholdName(response.data.householdName);
            setNewHouseholdName(response.data.householdName);

            // USER NAMES
            const memberIds = response.data.members;

            const userPromises = memberIds.map(u_id =>
                api.get(`${USER_API}/${u_id}`, {
                    headers: {Authorization: `Bearer ${accessToken}`}
                })
            );

            const usersResponses = await Promise.all(userPromises);
            const userNames = usersResponses.map(res => `${res.data.first_name} ${res.data.last_name}`);
            setHouseholdUsers(userNames);

            console.log(userNames);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        reloadData();
    }, []); //idk why it throws a warning, i just wanna run it once on mount

    function generateKey(taskName, taskDesc) {
        return new Date()
                .toLocaleString()
                .trim()
                .replace(/[,.:/\\ ]/g, '')
            + (Math.floor(Math.random() * 1000))
            + taskName.substring(0, Math.min(4, taskName.length))
            + taskDesc.substring(0, Math.min(4, taskDesc.length))
    }

    function addTask(taskName, taskDescription, interval, lastDoneDate, assignedUser) {
        const newChore = new HouseHoldTask(taskName, taskDescription, interval, lastDoneDate, assignedUser, generateKey(taskName, taskDescription));
        setHouseholdChores([...householdChores, newChore]);

        setChangesMade(true);
    }

    function updateTask(newItem) {
        setHouseholdChores(householdChores.map(item => item.key === newItem.key ? newItem : item));

        setChangesMade(true);
    }

    function deleteTask(itemToDelete) {
        setHouseholdChores(householdChores.filter(item => item.key !== itemToDelete.key));

        setChangesMade(true);
    }

    useEffect(() => {
        if (editingHouseholdName) {
            houseHoldNameInput.current?.focus();
            setNewHouseholdName(householdName);
        }
    }, [editingHouseholdName]); // why are you warning me??? its the dependency i want

    async function saveHouseholdName() {
        setEditingHouseholdName(false);

        const trimmedNewName = newHouseholdName.trim();
        if (trimmedNewName.length <= 0) {
            // empty name, revert
            setNewHouseholdName(householdName);
            return;
        }

        setHouseholdName(trimmedNewName);

        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await api.put(`${HOUSEHOLD_API}/${id}`, {householdName: trimmedNewName}, {
                headers: {Authorization: `Bearer ${accessToken}`}
            });
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function persistChanges() {
        try {
            const accessToken = localStorage.getItem("accessToken");
            // const householdModel = new HouseHoldModel(houseHold.householdName, householdChores, houseHold.members);
            const response = await api.put(`${HOUSEHOLD_API}/${id}`, {tasks: latestTasksRef.current}, {
                headers: {Authorization: `Bearer ${accessToken}`}
            });
            console.log(response.data);
            setChangesMade(false);
        } catch (error) {
            console.log(error);
        }
    }

    async function onUserAdded(userId) {
        console.log(userId);
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await api.put(`${HOUSEHOLD_API}/${id}`, {members: [...houseHold.members, userId.toString()]}, {
                headers: {Authorization: `Bearer ${accessToken}`}
            });
            console.log(response.data);
            await reloadData();
        } catch (error) {
            console.log(error);
        }
    }

    async function onUserRemoved(userId) {
        console.log(userId);
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await api.put(`${HOUSEHOLD_API}/${id}`, {members: houseHold.members.filter(id => id != userId)}, {
                headers: {Authorization: `Bearer ${accessToken}`}
            });
            console.log(response.data);
            await reloadData();
        } catch (error) {
            console.log(error);
        }
    }

    // const openWarningNotification = () => {
    //     notification.warning({
    //         message: t('generic.warning'),
    //         description: (
    //             <Space direction="vertical">
    //                 <p>{t('household.changeInfo')}</p>
    //                 <Space>
    //                     <Button type="primary" onClick={() => persistChanges()}>
    //                         {t('household.saveChanges')}
    //                     </Button>
    //                     <Button onClick={() => reloadData()} danger>
    //                         {t('household.discardChanges')}
    //                     </Button>
    //                 </Space>
    //             </Space>
    //         ),
    //         placement: 'bottomRight', // bottom-right corner
    //         duration: 0,              // 0 = stay open until closed
    //     });
    // };
    //
    // let warningNotificationShown = false;
    //
    // const openWarningNotification = () => {
    //     if (warningNotificationShown) return;
    //
    //     warningNotificationShown = true;
    //
    //     notification.warning({
    //         message: t('generic.warning'),
    //         description: (
    //             <Space direction="vertical">
    //                 <p>{t('household.changeInfo')}</p>
    //                 <Space>
    //                     <Button
    //                         type="primary"
    //                         onClick={() => {
    //                             persistChanges();
    //                             notification.destroy(); // closes the notification
    //                             warningNotificationShown = false; // reset flag if needed
    //                         }}
    //                     >
    //                         {t('household.saveChanges')}
    //                     </Button>
    //                     <Button
    //                         danger
    //                         onClick={() => {
    //                             reloadData();
    //                             notification.destroy(); // closes the notification
    //                             warningNotificationShown = false; // reset flag if needed
    //                         }}
    //                     >
    //                         {t('household.discardChanges')}
    //                     </Button>
    //                 </Space>
    //             </Space>
    //         ),
    //         placement: 'bottomRight',
    //         duration: 0,
    //         closeIcon: null,
    //         key: 'unique_warning',
    //     });
    // };
    const notificationShownRef = useRef(false);

    useEffect(() => {
        // Only show notification if there are unsaved changes and it's not already open
        if (changesMade && !notificationShownRef.current) {
            notificationShownRef.current = true;

            notification.warning({
                key: 'unique_warning',
                message: t('generic.warning'),
                description: (
                    <Space direction="vertical">
                        <p>{t('household.changeInfo')}</p>
                        <Space>
                            <Button
                                type="primary"
                                onClick={async () => {
                                    await persistChanges()
                                    // await persistChanges(latestTasksRef.current); // use latest state
                                    notification.destroy();
                                    notificationShownRef.current = false;
                                    setChangesMade(false);
                                }}
                            >
                                {t('household.saveChanges')}
                            </Button>

                            <Button
                                danger
                                onClick={async () => {
                                    await reloadData();
                                    notification.destroy();
                                    notificationShownRef.current = false;
                                    setChangesMade(false);
                                }}
                            >
                                {t('household.discardChanges')}
                            </Button>

                        </Space>
                    </Space>
                ),
                placement: 'bottomRight',
                duration: 0,
                closeIcon: null,
                onClose: () => {
                    notificationShownRef.current = false;
                },
            });
        }
    }, [changesMade]);




    // const changesPanel = (
        // <div>
        //   <p>{t('household.changeInfo')}</p>
        //   <div className="flex flex-row gap-2">
        //     <Button onClick={() => persistChanges()}>{t('household.saveChanges')}</Button>
        //     <Button onClick={() => reloadData()}>{t('household.discardChanges')}</Button>
        //   </div>
        // </div>

    //     <Alert
    //         message={t('generic.warning')}
    //         description={
    //             <Space direction="vertical">
    //                 <p>{t('household.changeInfo')}</p>
    //                 <Space>
    //                     <Button type="primary" onClick={() => persistChanges()}>
    //                         {t('household.saveChanges')}
    //                     </Button>
    //                     <Button onClick={() => reloadData()} danger>
    //                         {t('household.discardChanges')}
    //                     </Button>
    //                 </Space>
    //             </Space>
    //         }
    //         type="warning"
    //         showIcon
    //     />
    //
    // );

    const tableContent = householdChores.map(task =>
        (<ChoreItem taskItem={task} userList={householdUsers} onUpdate={item => updateTask(item)}
                    onDelete={item => deleteTask(item)} key={task.key}/>)
    );

    function isHouseHoldOwner() {
        return user._id.toString() == houseHold.members[0].toString();
    }


    if (loading) {
        return <LoadingSpinner/>;
    }

    const userMap = houseHold.members.map((u_id, index) => {
        return {id: u_id.toString(), username: householdUsers[index]}
    });

    const householdNameInput =
        (<>
            <input type="text" value={newHouseholdName} onInput={e => setNewHouseholdName(e.target.value)}
                   onBlur={() => saveHouseholdName()} ref={houseHoldNameInput}/>
        </>);

    const householdNameTitle =
        (<div className="flex flex-row gap-2">
            <h1>{householdName}</h1>
            {isHouseHoldOwner() && (
                <Button
                    type="text"
                    icon={<EditOutlined/>}
                    onClick={() => setEditingHouseholdName(true)}
                />
            )}

        </div>);

    const householdHeader = editingHouseholdName ? householdNameInput : householdNameTitle;

    const getPercentTag = (daysLeft, percentUsed) => {
        const getDueText = (daysLeft) => {
            if (daysLeft === 0) {
                return t('household.dueToday');
            }

            if (daysLeft < 0) {
                return t('household.overdueBy', {
                    count: Math.abs(daysLeft)
                });
            }

            return t('household.dueIn', {
                count: daysLeft
            });
        };


        if (percentUsed === null) {
            return <Tag>-</Tag>;
        }
        const color =
            percentUsed > 1 ? 'red' :
                percentUsed >= 0.9 ? 'volcano' :
                    percentUsed >= 0.7 ? 'gold' :
                        percentUsed >= 0.4 ? 'lime' :
                            'green';

        return (
            <Tag color={color} variant="solid">
                {getDueText(daysLeft)}
            </Tag>
        );
        //
        // if (percentUsed > 1) {
        //     return <Tag color="red" variant={"solid"}>Overdue</Tag>;
        // }
        //
        // if (percentUsed >= 0.9) {
        //     return <Tag color="volcano" variant={"solid"}>{getDueText(daysLeft)}</Tag>;
        // }
        //
        // if (percentUsed >= 0.7) {
        //     return <Tag color="gold" variant={"solid"}>{getDueText(daysLeft)}</Tag>;
        // }
        //
        // if (percentUsed >= 0.4) {
        //     return <Tag color="lime" variant={"solid"}>{getDueText(daysLeft)}</Tag>;
        // }
        //
        // return <Tag color="green" variant={"solid"}>
        //     {getDueText(daysLeft)}
        // </Tag>;
    };



    const columns = [
        {
            title: t('household.daysLeft'),
            key: 'daysLeft',
            width: 140,
            fixed: 'left',
            render: (_, record) =>
                getPercentTag(record.daysLeft, record.percentUsed),
            sorter: (a, b) => (a.percentUsed ?? 0) - (b.percentUsed ?? 0),
        },
        {
            title: t('household.task'),
            dataIndex: 'taskName',
            key: 'taskName',
            // fixed: 'left',
            width: 200,
            // ellipsis: true,
            render: (_, record) => (
                <div style={{
                    whiteSpace: 'normal',   // Overrides 'nowrap'
                    wordWrap: 'break-word', // Breaks long words
                    wordBreak: 'break-word',
                    lineHeight: '1.5'
                }}>
                <EditableCell
                    value={record.taskName}
                    isEditing={editing.key === record.key && editing.field === 'taskName'}
                    onEdit={() => setEditing({key: record.key, field: 'taskName'})}
                    onSave={(value) => {
                        updateTask(new HouseHoldTask(
                            value,
                            record.taskDescription,
                            record.interval,
                            record.lastDoneDate,
                            record.assignedUser,
                            record.key
                        ));
                        setEditing({key: null, field: null});
                    }}
                />
                </div>
            ),
            sorter: (a, b) => a.taskName.localeCompare(b.taskName),
            sortDirections: ['ascend', 'descend'],
        },
        // {
        //     title: t('household.description'),
        //     dataIndex: 'taskDescription',
        //     key: 'taskDescription',
        //     width: 200,
        //     ellipsis: true,
        //     render: (_, record) => (
        //         <EditableCell
        //             value={record.taskDescription}
        //             isEditing={editing.key === record.key && editing.field === 'taskDescription'}
        //             onEdit={() => setEditing({key: record.key, field: 'taskDescription'})}
        //             onSave={(value) => {
        //                 updateTask(new HouseHoldTask(
        //                     record.taskName,
        //                     value,
        //                     record.interval,
        //                     record.lastDoneDate,
        //                     record.assignedUser,
        //                     record.key
        //                 ));
        //                 setEditing({key: null, field: null});
        //             }}
        //         />
        //     ),
        //     sorter: (a, b) => a.taskDescription.localeCompare(b.taskDescription),
        //     sortDirections: ['ascend', 'descend'],
        // },
        {
            title: t('household.interval'),
            dataIndex: 'interval',
            key: 'interval',
            width: 100,
            render: (_, record) => (
                <EditableCell
                    value={record.interval}
                    inputType="number"
                    isEditing={editing.key === record.key && editing.field === 'interval'}
                    onEdit={() => setEditing({key: record.key, field: 'interval'})}
                    onSave={(value) => {
                        updateTask(new HouseHoldTask(
                            record.taskName,
                            record.taskDescription,
                            Number(value),
                            record.lastDoneDate,
                            record.assignedUser,
                            record.key
                        ));
                        setEditing({key: null, field: null});
                    }}
                />
            ),
            sorter: (a, b) => a.interval - b.interval,
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: t('household.lastDone'),
            dataIndex: 'lastDoneDate',
            key: 'lastDoneDate',
            width: 140,
            render: (_, record) => (
                <EditableCell
                    value={record.lastDoneDate}
                    inputType="date"
                    isEditing={editing.key === record.key && editing.field === 'lastDoneDate'}
                    onEdit={() => setEditing({key: record.key, field: 'lastDoneDate'})}
                    onSave={(value) => {
                        updateTask(new HouseHoldTask(
                            record.taskName,
                            record.taskDescription,
                            record.interval,
                            value,
                            record.assignedUser,
                            record.key
                        ));
                        setEditing({key: null, field: null});
                    }}
                />
            ),
            sorter: (a, b) => new Date(a.lastDoneDate) - new Date(b.lastDoneDate),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: t('household.assignedTo'),
            dataIndex: 'assignedUser',
            key: 'assignedUser',
            width: 140,
            render: (_, record) => (
                <EditableCell
                    value={record.assignedUser}
                    isEditing={editing.key === record.key && editing.field === 'assignedUser'}
                    inputType="select"
                    options={householdUsers}
                    onEdit={() => setEditing({ key: record.key, field: 'assignedUser' })}
                    onSave={(value) => {
                        updateTask(new HouseHoldTask(
                            record.taskName,
                            record.taskDescription,
                            record.interval,
                            record.lastDoneDate,
                            value,
                            record.key
                        ));
                        setEditing({ key: null, field: null });
                    }}
                />
            ),
            filters: householdUsers.map(user => ({ text: user, value: user })),
            onFilter: (value, record) => record.assignedUser === value,
            filterSearch: true,
        },

        {
            title: t('household.status'),
            key: 'status',
            width: 140,
            render: (_, record) => {
                if (!record.lastDoneDate || !record.interval) return '-';
                const due = new Date(record.lastDoneDate);
                due.setDate(due.getDate() + Number(record.interval));
                return due.toLocaleDateString();
            },
            sorter: (a, b) => {
                const dateA = new Date(a.lastDoneDate || 0);
                dateA.setDate(dateA.getDate() + Number(a.interval || 0));
                const dateB = new Date(b.lastDoneDate || 0);
                dateB.setDate(dateB.getDate() + Number(b.interval || 0));
                return dateA - dateB;
            },
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: t('household.actions'),
            key: 'actions',
            width: 140,
            fixed: 'right',
            render: (_, record) => {
                const markAsDone = () => {
                    const today = new Date().toISOString().split("T")[0];
                    updateTask(new HouseHoldTask(record.taskName, record.taskDescription, record.interval, today, record.assignedUser, record.key));
                };
                return (
                    <Space size="small">
                        <Button size="small" icon={<CheckOutlined />} type="primary" onClick={markAsDone}>{t('household.markDone')}</Button>
                        {/*<Button size="small" icon={<DeleteOutlined />} danger onClick={() => deleteTask(record.rawTask)}>*/}

                        {/*{t('household.remove')}*/}
                        {/*</Button>*/}
                        <Popconfirm title={t('household.remove')} onConfirm={() => deleteTask(record.rawTask)}>
                            <Button
                                shape="circle"
                                danger
                                type="text"
                                icon={<DeleteOutlined />}
                            />
                        </Popconfirm>
                    </Space>
                );
            }
        },

    ];
    const MS_PER_DAY = 1000 * 60 * 60 * 24;

    const data = householdChores.map(task => {
        let daysLeft = null;
        let percentUsed = null;

        if (task.lastDoneDate && task.interval) {
            const lastDone = new Date(task.lastDoneDate);
            const today = new Date();
            const daysSinceDone = Math.floor((today - lastDone) / MS_PER_DAY);
            daysLeft = task.interval - daysSinceDone;
            percentUsed = daysSinceDone / task.interval;

        }

        return {
            key: task.key,
            taskName: task.taskName,
            taskDescription: task.description,
            interval: task.interval,
            lastDoneDate: task.lastDoneDate,
            assignedUser: task.assignedUser,
            daysLeft,
            percentUsed,
            rawTask: task
        };
    });


    return (
        <>
            {/*<Button onClick={() => navigate("/dashboard")} icon={<ArrowLeftOutlined/>}> Dashboard</Button>*/}

            {householdHeader}
            <h2>{t('household.loggedInAs')} {userModel?.fullName}</h2>
            {/*<h2>{t('household.choreTitle')}</h2>*/}


            {/* Responsive layout: form + table */}
            <Row gutter={[16, 16]}>
                <Col xs={24} md={6}>
                    {/*<Card title="Add New Task">*/}
                        <ChoreInput onSubmit={addTask} userList={householdUsers}/>
                    {/*</Card>*/}
                </Col>


                <Col xs={24} md={18}>
                    <Card title={t('household.choreTitle')}>
                        <Table
                            columns={columns}
                            dataSource={data}
                            scroll={{ x: 'max-content' }}
                            size="small"
                            pagination={{
                                defaultPageSize: 7,
                                showSizeChanger: true, // This MUST be true for the dropdown to appear
                                pageSizeOptions: ['7', '14', '21', '50'],
                                showTotal: (total, range) => t('household.paginationTotal', {
                                    range0: range[0],
                                    range1: range[1],
                                    total: total
                                }),
                                position: ['bottomCenter'],
                            }}
                            showSorterTooltip={{ target: 'sorter-icon' }}
                            expandable={{
                                expandedRowRender: (record) => (
                                    <div style={{ padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
                                        <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
                                            {t('household.description')}:
                                        </div>
                                        <EditableCell
                                            value={record.taskDescription}
                                            isEditing={editing.key === record.key && editing.field === 'taskDescription'}
                                            onEdit={() => setEditing({ key: record.key, field: 'taskDescription' })}
                                            inputType="text"
                                            onSave={(value) => {
                                                updateTask(new HouseHoldTask(
                                                    record.taskName,
                                                    value,
                                                    record.interval,
                                                    record.lastDoneDate,
                                                    record.assignedUser,
                                                    record.key
                                                ));
                                                setEditing({ key: null, field: null });
                                            }}
                                        />
                                    </div>
                                ), // End of expandedRowRender
                                rowExpandable: (record) => true,
                            }} // End of expandable object
                        /> {/* End of Table */}
                    </Card>
                </Col>
            </Row>


            {/*{changesMade && openWarningNotification()}*/}


            {/*{isHouseHoldOwner() && <AddPeopleInput*/}
            {/*    onUserAdded={onUserAdded}*/}
            {/*    onUserDeleted={onUserRemoved}*/}
            {/*    userIdList={houseHold.members}*/}
            {/*    hasUnsavedChanges={changesMade}*/}
            {/*    users={userMap}*/}
            {/*    loggedInUserId={user._id.toString()}*/}
            {/*/>}*/}

            {isHouseHoldOwner() && (
                <Card bordered style={{ margin: '20px auto' }}>
                    <AddPeopleInput
                        onUserAdded={onUserAdded}
                        onUserDeleted={onUserRemoved}
                        userIdList={houseHold.members}
                        hasUnsavedChanges={changesMade}
                        users={userMap}
                        loggedInUserId={user._id.toString()}
                    />
                </Card>
            )}

        </>

    )
}

export default HouseHold
