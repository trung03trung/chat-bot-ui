import {
    Box,
    Button,
    CssBaseline,
    Divider,
    Link,
    ThemeProvider,
    Typography,
    createTheme,
} from '@mui/material';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {
    ActionRequest,
    AudioActionResponse,
    ChatController,
    FileActionResponse,
    MuiChat,

// eslint-disable-next-line import/no-absolute-path
} from 'chat-ui-react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {useState} from 'react';

const muiTheme = createTheme({
    palette: {
        primary: {
            main: '#007aff',
        },
    },
});

const YN=[
        {
            value: 'có',
            text: 'Có',
        },
        {
            value: 'không',
            text: 'Không',
        },
]

export function App(): React.ReactElement {
    const [chatCtl] = React.useState(
        new ChatController({
            showDateTime: true,
        }),
    );

    React.useMemo(() => {
        echo(chatCtl);
    }, [chatCtl]);

    return (
        <ThemeProvider theme={muiTheme}>
            <CssBaseline/>
            <Box sx={{height: '100%', backgroundColor: 'gray'}}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        maxWidth: '640px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        bgcolor: 'background.default',
                    }}
                >
                    <Typography sx={{p: 1}}>
                        Chào mừng bạn đến với chat bot tư vấn y học thể thao
                    </Typography>
                    <Divider/>
                    <Box sx={{flex: '1 1 0%', minHeight: 0}}>
                        <MuiChat chatController={chatCtl}/>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

async function echo(chatCtl: ChatController): Promise<void> {
    if (chatCtl.getMessages().length === 0) {
        await chatCtl.addMessage({
            type: 'text',
            content: `Hãy chat gì đó để bot biết bạn đang hoạt động`,
            self: false,
            avatar: 'https://www.shutterstock.com/shutterstock/photos/1222464061/display_1500/stock-vector-chatbot-robo-advisor-robo-adviser-chat-bot-robot-like-assistant-concept-of-digital-advisor-1222464061.jpg',
        });
    }
    const text = await ((chatCtl.getMessages().at(chatCtl.getMessages().length - 1)?.content === 'Bạn từng có tiểu sử bệnh án gì không?') && chatCtl.setActionRequest({
        type: 'select',
        options: [
            {
                value: 'có',
                text: 'có',
            },
            {
                value: 'không',
                text: 'không',
            },
        ],
    }) || (chatCtl.getMessages().at(chatCtl.getMessages().length - 1)?.content === 'Giới tính của bạn là gì(0: Nữ,1: Nam)?') && chatCtl.setActionRequest({
        type: 'select',
        options: [
            {
                value: '1',
                text: '1',
            },
            {
                value: '0',
                text: '0',
            },
        ],
    }) || (chatCtl.getMessages().at(chatCtl.getMessages().length - 1)?.content.toString().includes('Bạn có bị 1 trong các'))
        && chatCtl.setActionRequest({
                type: 'select',
                options: [
                    {
                        value: 'có',
                        text: 'có',
                    },
                    {
                        value: 'không',
                        text: 'không',
                    },
                ],
            })
        || chatCtl.setActionRequest({
        type: 'text',
        placeholder: 'Please enter something',
    }));
    const response1 = await fetch(`https://chat-bot-health-care.herokuapp.com/?message=${text.value}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'charset': 'UTF-8',
        },
        credentials: "same-origin",
    }).then(response => response.json());
    const parseJson = await response1.reply;
    await chatCtl.addMessage({
        type: 'text',
        content: `${parseJson}`,
        self: false,
        avatar: 'https://www.shutterstock.com/shutterstock/photos/1222464061/display_1500/stock-vector-chatbot-robo-advisor-robo-adviser-chat-bot-robot-like-assistant-concept-of-digital-advisor-1222464061.jpg',
    });


    echo(chatCtl);
}

function GoodInput({
                       chatController,
                       actionRequest,
                   }: {
    chatController: ChatController;
    actionRequest: ActionRequest;
}) {
    const chatCtl = chatController;

    const setResponse = React.useCallback((): void => {
        const res = {type: 'custom', value: 'Good!'};
        chatCtl.setActionResponse(actionRequest, res);
    }, [actionRequest, chatCtl]);

    return (
        <div>
            <Button
                type="button"
                onClick={setResponse}
                variant="contained"
                color="primary"
            >
                Good!
            </Button>
        </div>
    );
}
