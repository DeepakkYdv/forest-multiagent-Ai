import Router from 'express';
import { createConversation, delConversation, getConversation, getMessages, saveMessage, updateConversation } from '../controllers/chat.controllers.js';

const router = Router();

router.post('/create-conversation', createConversation);
router.post('/update-conversation', updateConversation);
router.post('/save-message', saveMessage);
router.delete('/delete-conversation/:conversationId', delConversation);

router.get('/conversations', getConversation);
router.get('/messages/:conversationId', getMessages);

export default router;