import * as admin from "firebase-admin";
import { logger } from "firebase-functions";
import { Message } from "firebase-admin/lib/messaging/messaging-api";
import * as functions from "firebase-functions";
const db = admin.firestore();
// admin.initializeApp();

export const onCreateNotice = functions.firestore.document('notices/{id}').onCreate(async(snapshot, context)=>{
    const data = snapshot.data();
        const tokenQuery = await db.collection('tokens').get();
        logger.log("notice found: ",data);
        try {
            if(!tokenQuery.empty){
                for(const doc of tokenQuery.docs){
                    const token = doc.data().token;
                    if(token && token !==''){
                        // const imgUrl = data.line_items[0].image.src
                        const payload:Message = {
                            token:token,
                            notification:{
                                title:'New notice',
                                body:"A notice has been created by admin, check it out",
                                // imageUrl:imgUrl
                            }
                        };
                        logger.log('Token----------', token)
                        await admin.messaging().send(payload).catch(async err=>{
                            if(err.code === 'messaging/registration-token-not-registered'){
                                await doc.ref.delete();
                            }
                        });
                        logger.log('notification sent')
                    }
                }
            } 
        } catch (error) {
            logger.log("catch an error in notification : ",error)
        }
})