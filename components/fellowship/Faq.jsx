/* eslint-disable react/no-unescaped-entities */
import Accordion from '@/components/Accordion';

const Faq = () => {
    return (
        <div className="w-full flex flex-col items-center lg:gap-[80px] gap-10 justify-center max-lg:py-[40px] max-lg:px-4 px-[80px] py-[140px]">
            <h2 className="h2">Frequently Asked Questions</h2>
            <div className="w-full flex flex-col gap-4 max-lg:gap-2">
            <Accordion
                title="Who can apply for the program?"
                content="The program is open to undergraduates and recent graduates who are eager to start or advance their careers. Whether you're unsure about your career path or have multiple interests, the Epoch Mentorship Program can help you clarify your direction and take actionable steps."
            />
            <Accordion
                title="Is there a fee to participate?"
                content="The program is free, but there is a refundable commitment fee of 7,000 NGN. This fee is not a payment for the program but a way to show your dedication. It doesn’t reflect the program’s true value; it’s simply a gesture of commitment. The fee will be fully refunded to participants who complete the program and meet all requirements. For those who may need to stop halfway, a partial refund will be provided. Watch this video for more details."
            />
            <Accordion
                title="What can I expect to achieve by the end of the program?"
                content="By the end of the program, participants are expected to have completed a project that showcases their skills and knowledge in their chosen field. This could range from developing a website to creating a financial model to launching your business, depending on the participant's career path."
            />
            <Accordion
                title="Are there any additional workshops or resources provided?"
                content="Yes, the program includes workshops on topics such as LinkedIn optimization, networking, CV writing, cover letter crafting, business writing, communication, and leadership. These workshops are designed to equip you with the essential skills needed to thrive in your career."
            />
            <Accordion
                title="What happens if I am unable to complete the program?"
                content="Participants are expected to stay committed throughout the program. However, if there is prolonged non-commitment, participants may be removed from the program as per the guidelines in the “Mentorship Charter.”"
            />
            <Accordion
                title="Can I join the program even if I'm not sure about my career path?"
                content="Absolutely! The Discovery Phase is specifically designed to help you explore different career options and find the path that aligns with your interests and skills."
            />
            <Accordion
                title="How do I apply for the program?"
                content="Applications are open prior to the program's start date. You'll need to complete an application form, and selected participants will be admitted based on their application and alignment with the program’s goals."
            />
            <Accordion
                title="How long does the program last?"
                content="The program typically lasts between 10 to 16 weeks, depending on your career path and the complexity of your final project. While the duration may vary, it will not be shorter than 10 weeks. Our main goal is to ensure that every participant gains valuable experience. If, by week 16, you haven’t completed the program but have shown consistent commitment, we’ll extend the duration to support your progress."
            />
            <Accordion
                title="Is there support after the program ends?"
                content="Yes, our commitment to your success doesn’t end when the program does. We continue to support you on your journey with tailored post-program assistance. This includes regular one-on-one check-ins, which can be monthly, quarterly, or bi-annual, depending on your level and specific needs. We’re here to ensure you stay on track and achieve your career goals even after the program concludes."
            />
            </div>
        </div>
    );
};

export default Faq;
