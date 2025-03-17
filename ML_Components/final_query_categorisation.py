import os
import re
import string
import whisper
import pandas as pd
from pydub import AudioSegment
from moviepy.editor import VideoFileClip
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB

# -------------- 🔹 Step 1: Audio/Video Transcription using Whisper 🔹 -------------- #
def extract_audio(input_path, output_audio_path="converted_audio.wav"):
    """Extracts audio from a video or converts an existing audio file to WAV (16kHz mono)."""
    file_ext = os.path.splitext(input_path)[-1].lower()

    # If the input is a video, extract audio
    if file_ext in [".mp4", ".avi", ".mov", ".mkv", ".flv"]:
        try:
            print("Detected video file. Extracting audio...")
            video = VideoFileClip(input_path)
            audio = video.audio
            audio.write_audiofile(output_audio_path, logger=None)
            video.close()
            input_path = output_audio_path  # Set the extracted audio as input for conversion
        except Exception as e:
            print("Error extracting audio:", e)
            return None

    # Process the audio file (or the extracted audio) to convert it to 16 kHz mono WAV format
    try:
        print("Converting to 16 kHz mono for Whisper...")
        audio = AudioSegment.from_file(input_path)
        audio = audio.set_frame_rate(16000).set_channels(1)
        converted_audio_path = "converted_audio.wav"
        audio.export(converted_audio_path, format="wav")
        return converted_audio_path
    except Exception as e:
        print("Error processing audio:", e)
        return None

def transcribe_audio_whisper(audio_path, model_size="base"):
    """Transcribes audio using OpenAI's Whisper model."""
    try:
        print("Loading Whisper model...")
        model = whisper.load_model(model_size)
        print("Transcribing audio...")
        result = model.transcribe(audio_path)
        return result["text"]
    except Exception as e:
        print("Error during transcription:", e)
        return None

def process_file(input_path):
    """Processes audio/video: Extracts, transcribes, and returns text."""
    audio_path = extract_audio(input_path)
    if audio_path:
        transcript = transcribe_audio_whisper(audio_path)
        if transcript:
            print("Transcription:", transcript)
            return transcript  # Return text for further processing
    return None

# -------------- 🔹 Step 2: Train & Build Query Categorization Model 🔹 -------------- #

# Function to preprocess text
def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'\d+', '', text)  # Remove numbers
    text = text.translate(str.maketrans("", "", string.punctuation))  # Remove punctuation
    text = re.sub(r'\s+', ' ', text).strip()  # Remove extra spaces
    return text

# Define training queries for Loan Services (English, Hindi, Marathi, and mixed)
loan_queries_en = [
    "What is the interest rate on home loans?",
    "How can I apply for a personal loan?",
    "I need a car loan. What are the eligibility criteria?",
    "Please provide details for a home loan application.",
    "What is the processing fee for a business loan?",
    "Can I get a student loan with low interest rates?",
    "What documents are required for a loan application?",
    "When will my loan application be processed?",
    "How long does it take for a loan disbursement?",
    "What are the repayment options for a home loan?",
    "Can you help me calculate my EMI for a car loan?",
    "What is the maximum loan amount I can get?",
    "Are there any prepayment penalties for my loan?",
    "How can I check my loan application status?",
    "Can I restructure my existing loan?"
]

loan_queries_hi = [
    "घर लोन पर ब्याज दर क्या है?",
    "मैं पर्सनल लोन के लिए कैसे आवेदन कर सकता हूँ?",
    "मुझे कार लोन की आवश्यकता है, पात्रता मानदंड क्या हैं?",
    "कृपया घर लोन आवेदन के लिए विवरण प्रदान करें।",
    "बिजनेस लोन के लिए प्रोसेसिंग शुल्क क्या है?",
    "क्या मुझे कम ब्याज दर पर स्टूडेंट लोन मिल सकता है?",
    "लोन आवेदन के लिए कौन से दस्तावेज़ आवश्यक हैं?",
    "मेरा लोन आवेदन कब प्रोसेस किया जाएगा?",
    "लोन वितरण में कितना समय लगता है?",
    "घर लोन के लिए चुकौती विकल्प क्या हैं?",
    "क्या आप मेरी कार लोन के लिए EMI गणना में मदद कर सकते हैं?",
    "मुझे अधिकतम लोन राशि कितनी मिल सकती है?",
    "क्या मेरे लोन पर कोई प्रीपेमेंट दंड है?",
    "मैं अपने लोन आवेदन की स्थिति कैसे जांच सकता हूँ?",
    "क्या मैं अपने मौजूदा लोन को पुनर्गठित कर सकता हूँ?"
]

loan_queries_mr = [
    "घर कर्जावर व्याजदर किती आहे?",
    "मी वैयक्तिक कर्जासाठी कसा अर्ज करू शकतो?",
    "मला कार कर्जाची गरज आहे, पात्रता निकष काय आहेत?",
    "कृपया घर कर्ज अर्जासाठी तपशील द्या.",
    "व्यवसाय कर्जासाठी प्रक्रिया शुल्क किती आहे?",
    "कमी व्याजदरासह विद्यार्थी कर्ज मिळू शकते का?",
    "कर्ज अर्जासाठी कोणते दस्तऐवज आवश्यक आहेत?",
    "माझा कर्ज अर्ज केव्हां प्रक्रिया केला जाईल?",
    "कर्ज वितरणाला किती वेळ लागतो?",
    "घर कर्जासाठी परतफेडीचे पर्याय काय आहेत?",
    "तुम्ही माझ्या कार कर्जासाठी EMI गणना करण्यात मदत करू शकता का?",
    "मला मिळू शकणारी कमाल कर्जाची रक्कम किती आहे?",
    "माझ्या कर्जावर पूर्वपरतफेड दंड आहेत का?",
    "मी माझ्या कर्ज अर्जाची स्थिती कशी तपासू शकतो?",
    "मी माझे विद्यमान कर्ज पुन्हा संरचित करू शकतो का?"
]

loan_queries_mix = [
    "मुझे loan लेना है, पर details क्या चाहिए?",
    "What's the EMI for 10 lakh loan for 5 years?",
    "Car loan का interest rate बता सकते हैं?",
    "Plz tell me loan application के documents.",
    "अरे भाई, credit score कम है, loan मिलेगा क्या?",
    "घर के लिए loan लेना है, but salary irregular है.",
    "बैंक account में कितना balance चाहिए for personal loan?",
    "Iska processing charge क्या है, and कितने दिन लगेंगे?",
    "Home loan tax benefits क्या हैं? मुझे फायदा मिलेगा?",
    "My loan disbursement stuck है, customer care number मिल जाएगा?",
    "कैसे confirm करूँ कि मेरा loan approve हुआ या नहीं?",
    "मैंने auto loan लिया, क्या इसे refinance कर सकता हूँ?",
    "Low interest personal loan schemes for women available हैं?",
    "भाई, मेरा loan reject हुआ, अब क्या करूँ?",
    "कौनसे banks zero processing fee देते हैं?"
]

loan_queries_all = loan_queries_en + loan_queries_hi + loan_queries_mr + loan_queries_mix

# Define training queries for Deposit & Account Services
deposit_queries_en = [
    "What is the tenure of a fixed deposit?",
    "How much will be the maturity amount for my recurring deposit?",
    "Tell me about the interest rates on term deposits.",
    "How can I open a new deposit account?",
    "What are the benefits of a fixed deposit compared to a savings account?",
    "I want to know the deposit schemes available for senior citizens.",
    "Can you provide details on the current savings account interest rate?",
    "How do I update my KYC details for my account?",
    "What is the process to close my deposit account?",
    "How can I convert my fixed deposit into a recurring deposit?",
    "What are the minimum balance requirements for savings accounts?",
    "When will my deposit mature?",
    "Can I get a premature withdrawal on my fixed deposit?",
    "What is the interest payout frequency for my deposit?",
    "How do I check my account balance online?"
]

deposit_queries_hi = [
    "फिक्स्ड डिपॉजिट की अवधि क्या है?",
    "मेरे रिकरिंग डिपॉजिट की मैच्योरिटी राशि कितनी होगी?",
    "टर्म डिपॉजिट पर ब्याज दरों के बारे में बताएं।",
    "मैं नया डिपॉजिट अकाउंट कैसे खोल सकता हूँ?",
    "सेविंग्स अकाउंट की तुलना में फिक्स्ड डिपॉजिट के क्या फायदे हैं?",
    "वरिष्ठ नागरिकों के लिए उपलब्ध डिपॉजिट स्कीम्स के बारे में जानकारी चाहिए।",
    "कृपया वर्तमान सेविंग्स अकाउंट ब्याज दर के बारे में विवरण दें।",
    "मैं अपने अकाउंट के KYC विवरण कैसे अपडेट कर सकता हूँ?",
    "डिपॉजिट अकाउंट बंद करने की प्रक्रिया क्या है?",
    "मैं अपने फिक्स्ड डिपॉजिट को रिकरिंग डिपॉजिट में कैसे बदल सकता हूँ?",
    "सेविंग्स अकाउंट के लिए न्यूनतम बैलेंस क्या है?",
    "मेरा डिपॉजिट कब मैच्योर होगा?",
    "क्या मैं फिक्स्ड डिपॉजिट से प्रीमेच्योर विडड्रॉल ले सकता हूँ?",
    "मेरे डिपॉजिट का ब्याज भुगतान कितनी बार होता है?",
    "मैं अपने अकाउंट बैलेंस को ऑनलाइन कैसे चेक करूं?"
]

deposit_queries_mr = [
    "फिक्स्ड डिपॉजिटची मुदत काय आहे?",
    "माझ्या रिकरिंग डिपॉजिटची मैच्युरिटी रक्कम किती असेल?",
    "टर्म डिपॉजिटवरील व्याजदराबद्दल सांगा.",
    "मी नवीन डिपॉजिट खाते कसे उघडू शकतो?",
    "सेव्हिंग खातेच्या तुलनेत फिक्स्ड डिपॉजिटचे फायदे काय आहेत?",
    "वरिष्ठ नागरिकांसाठी उपलब्ध डिपॉजिट योजना काय आहेत?",
    "सध्याच्या सेव्हिंग खाते व्याजदराचे तपशील देऊ शकता का?",
    "मी माझ्या खात्याचे KYC तपशील कसे अपडेट करू शकतो?",
    "माझे डिपॉजिट खाते बंद करण्याची प्रक्रिया काय आहे?",
    "मी माझे फिक्स्ड डिपॉजिट रिकरिंग डिपॉजिटमध्ये कसे रूपांतरित करू शकतो?",
    "सेव्हिंग खात्यासाठी किमान शिल्लक किती आवश्यक आहे?",
    "माझे डिपॉजिट कधी मैच्युर होईल?",
    "फिक्स्ड डिपॉजिटवरून प्रीमेच्युअर विडड्रॉल घेऊ शकतो का?",
    "माझ्या डिपॉजिटचा व्याज किती वेळा दिला जातो?",
    "मी ऑनलाइन माझे खात्याचे शिल्लक कसे तपासू शकतो?"
]

deposit_queries_mix = [
    "मुझे FD की tenure बताओ, please?",
    "How much will be the maturity amount for my recurring डिपॉजिट?",
    "Term deposits का interest rate क्या है?",
    "नया deposit account open करना है, help?",
    "Savings account की तुलना में fixed deposit के benefits क्या हैं?",
    "Senior citizens के लिए deposit schemes के बारे में जानकारी चाहिए।",
    "Current savings account interest rate के details provide करो।",
    "How do I update my KYC details for my अकाउंट?",
    "Deposit account बंद करने की process क्या है?",
    "Can I convert my fixed deposit to recurring डिपॉजिट?",
    "Savings account के लिए minimum balance requirement क्या है?",
    "When will मेरा deposit mature?",
    "क्या मैं fixed deposit से premature withdrawal ले सकता हूँ?",
    "Interest payout frequency for my deposit क्या है?",
    "How do I check my account balance ऑनलाइन?"
]

deposit_queries_all = deposit_queries_en + deposit_queries_hi + deposit_queries_mr + deposit_queries_mix

# Define training queries for Operations & Service Requests
operations_queries_en = [
    "How to get a new cheque book issued?",
    "I need to transfer my account to another branch.",
    "How do I get a passbook issued?",
    "Please assist with updating my account details.",
    "Can you help me with account maintenance and service?",
    "I want to change my registered mobile number on my account.",
    "What is the process for issuing a duplicate cheque book?",
    "How can I update my email address in my account records?",
    "I need to stop a cheque payment immediately.",
    "How do I request a stop payment on my cheque?",
    "Please guide me to link my account with another bank.",
    "How do I resolve a discrepancy in my account details?",
    "I want to update my address linked with my account.",
    "How do I activate my net banking services?",
    "What is the process to register for SMS alerts for my account?"
]

operations_queries_hi = [
    "नया चेकबुक कैसे जारी कराएं?",
    "मुझे अपना अकाउंट दूसरे ब्रांच में ट्रांसफर करना है।",
    "पासबुक कैसे प्राप्त करूं?",
    "कृपया मेरे अकाउंट विवरण अपडेट करने में मदद करें।",
    "क्या आप अकाउंट मेंटेनेंस और सर्विस में सहायता कर सकते हैं?",
    "मैं अपने अकाउंट का रजिस्टर्ड मोबाइल नंबर बदलना चाहता हूँ।",
    "डुप्लिकेट चेकबुक जारी करने की प्रक्रिया क्या है?",
    "मैं अपने अकाउंट रिकॉर्ड में अपना ईमेल अपडेट कैसे करूँ?",
    "मुझे तुरंत चेक पेमेंट रोकना है।",
    "चेक पेमेंट रोकने के लिए अनुरोध कैसे करें?",
    "कृपया मेरा अकाउंट दूसरे बैंक से लिंक करने का मार्गदर्शन करें।",
    "मेरे अकाउंट विवरण में विसंगति को कैसे सुलझाऊं?",
    "मैं अपने अकाउंट से जुड़े पते को अपडेट करना चाहता हूँ।",
    "नेट बैंकिंग सेवाएं कैसे सक्रिय करें?",
    "मेरे अकाउंट के लिए SMS alerts रजिस्टर करने की प्रक्रिया क्या है?"
]

operations_queries_mr = [
    "नवीन चेकबुक कशी जारी करावी?",
    "माझे खाते दुसऱ्या शाखेत ट्रान्सफर करायचे आहेत.",
    "पासबुक कशी मिळवू शकतो?",
    "कृपया माझ्या खात्याचे तपशील अपडेट करण्यात मदत करा.",
    "खाते देखभाल आणि सेवेसाठी मदत हवी आहे.",
    "माझा रजिस्टर्ड मोबाइल नंबर बदलू इच्छितो.",
    "डुप्लिकेट चेकबुक जारी करण्याची प्रक्रिया काय आहे?",
    "माझ्या खात्याच्या रेकॉर्डमध्ये ईमेल कसा अपडेट करावा?",
    "मला त्वरित चेक पेमेंट थांबवायचे आहे.",
    "चेक पेमेंट थांबवण्यासाठी कसे विनंती करावी?",
    "कृपया माझे खाते दुसऱ्या बँकेशी लिंक करण्याचे मार्गदर्शन करा.",
    "माझ्या खात्यातील विसंगती कशी सोडवावी?",
    "माझ्या खात्याशी संबंधित पत्ता अपडेट कसा करावा?",
    "नेट बैंकिंग सेवा कशी सक्रिय करावी?",
    "माझ्या खात्यासाठी SMS alerts रजिस्टर करण्याची प्रक्रिया काय आहे?"
]

operations_queries_mix = [
    "How to get a new cheque book issue करवा?",
    "I need to transfer my account to another branch, जल्दी करो.",
    "पासबुक issue करने का तरीका बताओ?",
    "Please assist in updating my account details, jaldi.",
    "Account maintenance में help चाहिए, please.",
    "मेरा registered mobile number change करना है, how?",
    "Duplicate cheque book के लिए process बताओ.",
    "How can I update my email address in my account records, बताओ?",
    "I need to stop a cheque payment अभी.",
    "चेक पेमेंट रोकने के लिए request कैसे करें?",
    "Guide करो to link my account with another bank.",
    "मेरे account details में discrepancy है, fix करो.",
    "I want to update my address linked with my account, बताो.",
    "How do I activate my net banking services, please?",
    "SMS alerts register करने की process क्या है?"
]

operations_queries_all = operations_queries_en + operations_queries_hi + operations_queries_mr + operations_queries_mix

# Define training queries for Customer Grievance & Fraud Resolution
grievance_queries_en = [
    "I suspect fraudulent transactions in my account.",
    "There are unauthorized charges on my credit card.",
    "My debit card was used fraudulently.",
    "I noticed suspicious activity in my transaction history.",
    "Please block my account due to fraudulent transactions.",
    "I need to report a potential fraud case.",
    "Why were my funds debited without authorization?",
    "I want to lodge a complaint about a phishing attempt.",
    "There is an error in my bank statement; please investigate.",
    "I want to file a dispute for a transaction on my account.",
    "My account shows charges that I did not authorize.",
    "Please initiate a chargeback for the unauthorized transaction.",
    "I have been a victim of identity theft.",
    "Help me report suspicious online banking activity.",
    "I want to report a compromised account."
]

grievance_queries_hi = [
    "मुझे संदेह है कि मेरे खाते में धोखाधड़ी वाले लेनदेन हो रहे हैं।",
    "मेरे क्रेडिट कार्ड पर बिना अनुमति के शुल्क लगाए गए हैं।",
    "मेरा डेबिट कार्ड धोखाधड़ी से इस्तेमाल हुआ।",
    "मेरे ट्रांजेक्शन इतिहास में संदिग्ध गतिविधि देखी गई है।",
    "कृपया धोखाधड़ी वाले लेनदेन के कारण मेरा खाता ब्लॉक करें।",
    "मुझे संभावित धोखाधड़ी मामले की रिपोर्ट करनी है।",
    "मेरे फंड बिना अनुमति के डेबिट क्यों हुए?",
    "मैं फिशिंग प्रयास के बारे में शिकायत दर्ज करना चाहता हूँ।",
    "मेरे बैंक स्टेटमेंट में त्रुटि है; कृपया जांच करें।",
    "मैं अपने खाते पर हुए लेनदेन पर विवाद दर्ज करना चाहता हूँ।",
    "मेरे खाते में ऐसे शुल्क दिख रहे हैं जिन्हें मैंने अनुमति नहीं दी।",
    "कृपया बिना अनुमति के लेनदेन के लिए चार्जबैक शुरू करें।",
    "मुझे पहचान चोरी का शिकार बनाया गया है।",
    "मुझे संदिग्ध ऑनलाइन बैंकिंग गतिविधि की रिपोर्ट करनी है।",
    "मैं एक समझौता हुआ खाता रिपोर्ट करना चाहता हूँ।"
]

grievance_queries_mr = [
    "माझ्या खात्यात फसवणूकदार व्यवहाराचा शंका आहे.",
    "माझ्या क्रेडिट कार्डवर अनधिकृत शुल्क लावले आहेत.",
    "माझे डेबिट कार्ड फसवणुकीने वापरले गेले.",
    "माझ्या ट्रांजेक्शन इतिहासात संशयास्पद क्रियाकलाप आढळले आहेत.",
    "कृपया फसवणूकदार व्यवहारामुळे माझे खाते ब्लॉक करा.",
    "मला संभाव्य फसवणूक प्रकरणाची तक्रार करायची आहे.",
    "माझे निधी अनधिकृतपणे डेबिट का झाले?",
    "मी फिशिंग प्रयत्नाबद्दल तक्रार नोंदवू इच्छितो.",
    "माझ्या बँक स्टेटमेंटमध्ये त्रुटी आहेत; कृपया तपासा.",
    "मला माझ्या खात्यावरील व्यवहारावर विवाद नोंदवायचा आहे.",
    "माझ्या खात्यात अशा शुल्कांचा समावेश आहे जे मी मंजूर केले नाहीत.",
    "कृपया अनधिकृत व्यवहारासाठी चार्जबॅक सुरू करा.",
    "मला ओळख चोरीचा शिकार झाले आहे.",
    "संदिग्ध ऑनलाइन बँकिंग क्रियाकलापाबद्दल मला तक्रार करायची आहे.",
    "मी एक समझौता झालेले खाते रिपोर्ट करू इच्छितो."
]

grievance_queries_mix = [
    "Fraudulent transaction alert मिला, क्या करना चाहिए?",
    "Unauthorized transaction हुआ, how to dispute?",
    "Mere account से paise gayab हो गए, fraud?",
    "बैंक से पैसे कट गए पर transaction नहीं हुआ, help!",
    "Someone used my credit card बिना अनुमति के.",
    "Mujhe phishing call aaya bank के नाम से.",
    "बैंक app में suspicious activity दिख रही है, क्या करूँ?",
    "Cheque fraud हुआ, कैसे report करें?",
    "Someone hacked my online banking account, तुरंत action लो!",
    "Unauthorized deduction on my debit card, कैसे fix करें?",
    "क्या मैं duplicate charge के लिए refund claim कर सकता हूँ?",
    "मेरे account में unauthorized login alert आया, explain करें!",
    "बैंक statement में extra charges दिख रहे हैं, ये क्यों?",
    "किसी और ने मेरे नाम पर loan लिया है, help!",
    "My Aadhaar linked है but verification failing, please assist!"
]

grievance_queries_all = grievance_queries_en + grievance_queries_hi + grievance_queries_mr + grievance_queries_mix

# Combine training data with labels
training_data = (
    [(q, "Loan Services Department") for q in loan_queries_all] +
    [(q, "Deposit & Account Services Department") for q in deposit_queries_all] +
    [(q, "Operations & Service Requests Department") for q in operations_queries_all] +
    [(q, "Customer Grievance & Fraud Resolution Department") for q in grievance_queries_all]
)

# Create DataFrame and preprocess
df = pd.DataFrame(training_data, columns=["Query", "Category"])
df["Query"] = df["Query"].apply(preprocess_text)

# Encode labels
label_encoder = LabelEncoder()
df["Category"] = label_encoder.fit_transform(df["Category"])

# Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(df["Query"], df["Category"], 
                                                    test_size=0.2, random_state=42, stratify=df["Category"])

# Build Classification Pipeline
pipeline = Pipeline([
    ("vectorizer", TfidfVectorizer()),
    ("classifier", MultinomialNB(alpha=0.1))
])

# Train Model
pipeline.fit(X_train, y_train)

def classify_query_ml(query):
    """Classifies a text query into a department."""
    query = preprocess_text(query)
    category_index = pipeline.predict([query])[0]
    return label_encoder.inverse_transform([category_index])[0]

# -------------- 🔹 Step 3: Integrate Transcription & Classification 🔹 -------------- #
def handle_query(input_path):
    """
    End-to-end function to process an audio/video query:
    1. Extract & transcribe speech.
    2. Classify the transcribed text into a department.
    3. Return the department redirection result.
    """
    transcribed_text = process_file(input_path)
    if transcribed_text:
        department = classify_query_ml(transcribed_text)
        print(f"✅ Query Redirected To: {department}")
        return department
    else:
        print("❌ Could not process query.")
        return None

# ---------------- Example Usage ---------------- #
if __name__ == "__main__": # Corrected the variable name from _name_ to __name__
    # Replace with your actual file path (audio/video file)
    file_path = "/content/hindi_griev.mov"
    redirected_department = handle_query(file_path)
    print("Final Redirection:", redirected_department)