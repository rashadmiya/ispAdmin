import * as admin from "firebase-admin";
import { logger } from "firebase-functions";
import { Message } from "firebase-admin/lib/messaging/messaging-api";
admin.initializeApp();
import * as functions from "firebase-functions";
const db = admin.firestore();

export const onRegister = functions.firestore.document('registered_users/{id}').onCreate(async(snapshot, context)=>{
    const data = snapshot.data();
        const tokenQuery = await db.collection('tokens').get();
        logger.log("seen propertiy found: ",data?.seen);
        try {
            if(!tokenQuery.empty){
                for(const doc of tokenQuery.docs){
                    const token = doc.data().token;
                    if(token && token !==''){
                        // const imgUrl = data.line_items[0].image.src
                        const payload:Message = {
                            token:token,
                            notification:{
                                title:'New connection request',
                                body:"Got a new internet connection request on your ISP",
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