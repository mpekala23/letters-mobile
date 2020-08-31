import React from 'react';
import { Linking, ScrollView, Text } from 'react-native';
import { AuthStackParamList, Screen } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { Typography, Colors } from '@styles';
import Styles from './Privacy.styles';

type TermsScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Terms'
>;

interface Props {
  navigation: TermsScreenNavigationProp;
}

const TermsScreen: React.FC<Props> = (props: Props) => {
  return (
    <ScrollView style={Styles.scrollViewStyle}>
      <Text style={[Typography.FONT_SEMIBOLD, Styles.titleText]}>
        Ameelio Terms of Service
      </Text>
      <Text style={[Typography.FONT_SEMIBOLD, Styles.titleText]}>
        Effective Date: March 23, 2020
      </Text>
      <Text style={Styles.verticalPadding}>
        Ameelio, Inc. (“<Text style={Typography.FONT_SEMIBOLD}>Ameelio</Text>”,
        “<Text style={Typography.FONT_SEMIBOLD}>Company</Text>”, “
        <Text style={Typography.FONT_SEMIBOLD}>we</Text>”, “
        <Text style={Typography.FONT_SEMIBOLD}>our</Text>”, and “
        <Text style={Typography.FONT_SEMIBOLD}>us</Text>”) has created a
        communication service (collectively referred to as “
        <Text style={Typography.FONT_SEMIBOLD}>Services</Text>”) to connect
        individuals who are incarcerated with the free world to improve the
        lives of those impacted by incarceration and reduce recidivism rates.
        Ameelio also researches and studies prisons and prison systems and
        institutions, the institutions of the criminal justice system, and
        criminal justice policies to understand the impact of incarceration.
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'} 1. <Text style={Typography.FONT_SEMIBOLD}>Introduction. </Text>
        <Text>
          To assist you in using our Services, and to ensure a clear
          understanding of the relationship from your use of the Services, we
          have created these Terms of Services (the “
          <Text style={Typography.FONT_SEMIBOLD}>Terms</Text>”). The Terms
          constitute a binding agreement between you and Ameelio. The Terms
          govern your use of the Services and any other services offered as part
          of the Ameelio platform. The Terms also governs any information, text,
          graphics, photos, recordings, or other materials uploaded, downloaded,
          or appearing on the Services (collectively referred to as “
          <Text style={Typography.FONT_SEMIBOLD}>Content</Text>”).
        </Text>
      </Text>
      <Text style={Styles.bottomPadding}>
        Our Terms and Privacy Policy apply to all “
        <Text style={Typography.FONT_SEMIBOLD}>Free World Users</Text>,” “
        <Text style={Typography.FONT_SEMIBOLD}>Incarcerated Persons</Text>,” and
        any casual visitor to our Services who is not a Free World User or
        Incarcerated Person. Together, the Free World Users, Incarcerated
        Persons, and visitors to the Ameelio site are all “
        <Text style={Typography.FONT_SEMIBOLD}>Users</Text>.” The terms “you”
        and “your” includes anyone who uses the Services Ameelio offers. Unless
        otherwise indicated, all provisions of these Terms apply to all Users.
      </Text>
      <Text style={Styles.bottomPadding}>
        Please read this document carefully before you access, use, or
        participate in our services. By using or accessing our Services, you
        agree to be bound by the Terms. If you do not wish to be bound by the
        Terms, please do not access or use our Services.
      </Text>
      <Text style={Styles.bottomPadding}>
        PLEASE NOTE THAT, EXCEPT AS PROVIDED BELOW, THESE TERMS REQUIRE DISPUTE
        RESOLUTION THROUGH USE OF AN ARBITRATION SERVICE. YOU AGREE THAT ALL
        DISPUTES ARISING FROM, RELATED TO, OR IN CONNECTION WITH YOUR USE OF THE
        SERVICE WILL BE RESOLVED IN ACCORDANCE WITH THE ARBITRATION AND
        GOVERNING LAW PROVISIONS SET FORTH BELOW.
      </Text>
      <Text style={Styles.bottomPadding}>
        THESE SERVICES ARE NOT INTENDED TO BE USED FOR LEGAL SERVICES OR A
        SUBSTITUTE FOR LEGAL SERVICES. AS A USER, YOU AGREE THAT ALL CALLS,
        DATA, AND SUBMISSIONS ARE RECORDED AND CONTROLLED BY AMEELIO. ANY USE OF
        OR RELIANCE ON THE SERVICES IS AT YOUR OWN RISK.
      </Text>
      <Text style={Styles.bottomPadding}>
        WHEN YOU USE AMEELIO’S SERVICES, YOU ACKNOWLEDGE AND AGREE CONNECT
        SESSIONS ON AMEELIO WILL BE RECORDED AND MAY BE MONITORED. YOU AGREE AND
        YOU WAIVE ANY AND ALL CLAIMS AGAINST AMEELIO ARISING FROM THE RECORDING
        OF CONNECT SESSIONS.
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'} 2.{' '}
        <Text style={Typography.FONT_SEMIBOLD}>Changes to the Terms. </Text>
        <Text>
          We may change the Terms in the future. Ameelio reserves the right, and
          sole discretion, to modify these Terms at any time without prior
          notice. If we modify these Terms, we will either post a notification
          of the modification on our website or otherwise provide a notice of
          this change. Ameelio will post the latest modification date at the
          beginning of these Terms. If you do not agree with the new Terms, you
          are free to reject them; that means you will no longer be able to use
          the Services. It is your responsibility to check for updates. By
          continuing to access or use Ameelio after a change of the Terms is
          effective, you accept and agree to be bound by all modified Terms.
        </Text>
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'} 3. <Text style={Typography.FONT_SEMIBOLD}>Privacy Policy. </Text>
        <Text>
          Ameelio takes the privacy of its users seriously. Our{' '}
          <Text
            style={{ color: Colors.AMEELIO_BLUE }}
            onPress={() => props.navigation.navigate(Screen.Privacy)}
          >
            Privacy Policy{' '}
          </Text>
          discusses how we collect, process, and disclose personal information
          through these Services. Please review that policy carefully.
        </Text>
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'} 4. <Text style={Typography.FONT_SEMIBOLD}>Eligibility. </Text>
        <Text>
          In compliance with the Children’s Online Privacy Protection Act
          (COPPA), we do not collect information from any person under 13 years
          of age without consent from a parent or legal guardian. Please refer
          to our Privacy Policy{' '}
          <Text
            style={{ color: Colors.AMEELIO_BLUE }}
            onPress={() => props.navigation.navigate(Screen.Privacy)}
          >
            here
          </Text>
          . If you are under the age of 18, you may use the Services only under
          supervision of a parent or legal guardian who agrees to be bound by
          the Terms. If you are a parent or legal guardian agreeing to these
          terms, you are fully responsible for that user’s use of Ameelio.
          Additional information about the use of information can be found in
          the Privacy Policy{' '}
          <Text
            style={{ color: Colors.AMEELIO_BLUE }}
            onPress={() => props.navigation.navigate(Screen.Privacy)}
          >
            here
          </Text>
          .
        </Text>
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'} 5.{' '}
        <Text style={Typography.FONT_SEMIBOLD}>Explanation of Services. </Text>
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'} Ameelio aims to improve the lives of those impacted by
        incarceration and reduce recidivism. Ameelio researches and studies
        prisons and prison systems and institutions, the criminal justice
        system, its institutions and policies, and the impact of incarceration.
        Ameelio provides a prison communication software and various technology
        platforms, with the goal of enabling Incarcerated Persons to communicate
        with the outside world.
      </Text>
      <Text style={Styles.bottomPadding}>
        By using the Services, you grant Ameelio a non-exclusive, perpetual,
        world-wide, royalty-free license to use your User Content to perform the
        Services and conduct research.
      </Text>
      <Text style={Styles.bottomPadding}>
        We currently provide Services for free. Please be aware that if using a
        cell phone, normal rates and fees, such as data charges, will still
        apply.
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'} <Text style={Typography.FONT_SEMIBOLD}>Letters</Text>
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'} Free World Users can also use another function called “
        <Text style={Typography.FONT_SEMIBOLD}>Letters</Text>” to be able to
        send physical mail to Incarcerated Persons. To use Letters, a Free World
        User will need to register an account with your own personal information
        to verify your identity. The Free World User may also provide
        information about Incarcerated Person they would like to contact. The
        Free World User can type a letter and/or attach images. The letter will
        then be printed and sent by mail to the Incarcerated Person. Please see
        the Acceptable Use section below for permitted uses of the Letters.
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'} <Text style={Typography.FONT_SEMIBOLD}>Connect Session</Text>
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'} One service Ameelio provides is video and chat calls between Free
        World Users and Incarcerated Persons called “
        <Text style={Typography.FONT_SEMIBOLD}>Connect Sessions</Text>.” If you
        are a Free World User, you agree to register an account with personal
        information to verify your identity. Once an account is created, Free
        World Users can request permission from jail, prison, or organization
        administrators (“
        <Text style={Typography.FONT_SEMIBOLD}>Administrator</Text>
        ”) to schedule a video call with the Incarcerated Person.
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'} If you are an Incarcerated Person, you will be registered by the
        Administrator. The Administrator will be able to schedule a Connect
        Session on your behalf with a Free World User. Please contact an
        Administrator if you would like to discontinue use of our Services.
        Please see the Acceptable Use section below for permitted uses of the
        Connect Session.
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'} <Text style={Typography.FONT_SEMIBOLD}>Additional Services</Text>
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'} Ameelio is developing additional services to further our goal of
        improving the lives of those impacted by incarceration. As services are
        implemented, this Terms of Service will be updated.
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'} 6. <Text style={Typography.FONT_SEMIBOLD}>Acceptable Use. </Text>
        <Text>
          You may only use Ameelio for lawful activity. It is your
          responsibility to comply with all applicable local, state, and federal
          laws and regulations. You may not use Ameelio in any manner that is
          harmful, fraudulent, deceptive, threatening, harassing, defamatory,
          obscene, or otherwise objectionable. You are also responsible for any
          Content you submit by using Ameelio’s Services. You should ensure
          legality, accuracy, quality, integrity, reliability, and intellectual
          property ownership or right to use all Content you provide.
        </Text>
      </Text>
      <Text style={Styles.bottomPadding}>
        The Ameelio website, and any Services offered by Ameelio, are the sole
        property of Ameelio and are protected by U.S. copyright. Except for the
        limited rights expressly granted to you in the Terms, Ameelio reserves
        for itself and its licensors all other rights, title, and interest. You
        may not reproduce, modify, display, sell, or distribute any of Ameelio’s
        content or the products and Services described in any other way for
        public or commercial purpose. This includes products or Services with
        the “Ameelio” name, as well as the text, graphics, data, articles,
        photos, images, illustrations, and so forth are protected by copyright
        and other intellectual property laws.
      </Text>
      <Text style={Styles.bottomPadding}>
        Further, you acknowledge that the Ameelio Services, including all
        associated intellectual property rights, are the exclusive property of
        Ameelio and its licensors.
      </Text>
      <Text style={Styles.bottomPadding}>
        When using Letters, you grant us permission to work with third parties
        to print and send submitted messages on your behalf. You are responsible
        for providing the correct mailing address and keeping these contacts up
        to date and current. Ameelio is not responsible for mail delivered to
        the wrong or old address. Ameelio does not monitor Content submitted by
        you. Please be aware that Ameelio does not censor content, but the
        prison to which you are mailing may. Ameelio is not responsible for mail
        that was not delivered or mail that is rejected by prisons.
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'} 7.{' '}
        <Text style={Typography.FONT_SEMIBOLD}>
          Notices of Copyright Infringement.{' '}
        </Text>
        <Text>
          Ameelio respects the intellectual property rights of others. If
          Ameelio is notified that Content posted on our website allegedly
          violates someone’s copyright, we reserve the right to delete or
          disable the Content alleged to be infringing, and to terminate the
          accounts of any repeat alleged infringers.
        </Text>
      </Text>
      <Text style={Styles.bottomPadding}>
        If you believe any Content on this website infringes your copyright, you
        may request removal of these materials. To request removal of any
        Content and claim a copyright violation, you must:
      </Text>
      <Text>
        {'\t'}{' '}
        <Text>
          {'\u2022'} Provide your full legal name and electronic or physical
          signature.
        </Text>
      </Text>
      <Text>
        {'\t'}{' '}
        <Text>
          {'\u2022'} Identify the copyrighted work you claim is infringing on
          your copyright.
        </Text>
      </Text>
      <Text>
        {'\t'}{' '}
        <Text>
          {'\u2022'} Identify the Content that is claimed to be infringing or
          the subject of infringing activity with reasonable information to
          permit Ameelio to locate the Content, such as the URL where such
          Content can be found.
        </Text>
      </Text>
      <Text>
        {'\t'}{' '}
        <Text>
          {'\u2022'} Provide your mailing address, telephone number, and, if
          available, email address.
        </Text>
      </Text>
      <Text>
        {'\t'}{' '}
        <Text>
          {'\u2022'} Include a statement that you have a good faith belief that
          use of the copyrighted material is not authorized by the copyright
          owner, its agent, or the law.
        </Text>
      </Text>
      <Text>
        {'\t'}{' '}
        <Text>
          {'\u2022'} Include a statement that the information in the written
          notice is accurate.
        </Text>
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'}{' '}
        <Text>
          {'\u2022'} Include a statement that under penalty of perjury you are
          authorized to act on behalf of the copyright owner.
        </Text>
      </Text>
      <Text style={Styles.bottomPadding}>
        Submit this written notification to our Copyright Agent:
      </Text>
      <Text>
        {'\t'} <Text>{'\u2022'} Uzoma Orchingwa</Text>
      </Text>
      <Text>
        {'\t'} <Text>{'\u2022'} Ameelio, Inc.</Text>
      </Text>
      <Text>
        {'\t'} <Text>{'\u2022'} 50 Brewery Street #8382</Text>
      </Text>
      <Text>
        {'\t'} <Text>{'\u2022'} 203-680-0318</Text>
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'} <Text>{'\u2022'} team@ameelio.org</Text>
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'} 8. <Text style={Typography.FONT_SEMIBOLD}>User Accounts. </Text>
        <Text>
          Free World Users must register with Ameelio in order to use certain
          Services, including but not limited to Connect Sessions. If you are
          just browsing the site, registration is optional. Your account must be
          set up with a valid email address and a password that you create.
        </Text>
      </Text>
      <Text style={Styles.bottomPadding}>
        When you register an account with Ameelio, you agree to provide true
        information and promptly update any information with any changes to
        maintain accurate and complete information. You may not transfer your
        account to anyone else. If you provide information that is, or we have
        reasonable belief is, untrue or inaccurate, Ameelio may suspend or
        terminate your access to the Services and refuse any and all use of the
        Services.
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'} 9. <Text style={Typography.FONT_SEMIBOLD}>Termination. </Text>
        <Text>
          You agree that Ameelio may immediately and without notice terminate
          the Terms and disable your access to Ameelio. Ameelio may terminate or
          suspend your account or change your password for any reason. Some
          reasons may include if Ameelio determines, in its sole discretion,
          that you have materially breached these Terms, violated applicable
          laws, regulations, or third party rights. Ameelio may terminate your
          access if Ameelio believes, in good faith, that such action is needed
          to protect the safety or property of other Users, Ameelio, or third
          parties. Termination of your account may include removal of access to
          all Services and deletion of your password and all related
          information.
        </Text>
      </Text>
      <Text style={Styles.bottomPadding}>
        If we intend to deactivate a Free World User account, we will try to
        provide advance notice to you so you are able to retrieve any important
        information you have stored in your account. We may not provide advance
        notice if we determine it would be illegal, not in the interest of
        someone’s safety or security, impractical, or otherwise harmful to the
        rights of other Users.
      </Text>
      <Text style={Styles.bottomPadding}>
        If you are a Free World User and would like us to terminate your
        account, please contact us at{' '}
        <Text
          style={{ color: Colors.AMEELIO_BLUE }}
          onPress={() => Linking.openURL('mailto:team@ameelio.org')}
        >
          team@ameelio.org{' '}
        </Text>
        . Upon receipt of your request, we will deactivate your account within a
        reasonable time period. Please note that any information or
        conversations had using the Services will not be removed.
      </Text>
      <Text style={Styles.bottomPadding}>
        If you are an Incarcerated Person and would like to terminate your
        account, please contact your Administrator. The Administrator will then
        work with us to deactivate your account.
      </Text>
      <Text style={Styles.bottomPadding}>
        If your Ameelio account is closed (whether by you or us), your right to
        use the Ameelio Services stops immediately. Please note than any
        information or conversations had using Ameelio will not be removed.
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'} 10. <Text style={Typography.FONT_SEMIBOLD}>Warranties. </Text>
        <Text>YOU UNDERSTAND AND AGREE THAT:</Text>
      </Text>
      <Text>
        {'\t'}{' '}
        <Text>
          {' '}
          a. YOUR USE OF OUR WEBSITE, INCLUDING ANY CONTENT OR INFORMATION, OR
          ANY PRODUCT OR SERVICE THAT IS PROVIDED TO YOU, IS AT YOUR SOLE RISK.
          AMEELIO IS PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS. AMEELIO,
          OUR AFFILIATES, AND THIRD-PARTY SERVICE PROVIDERS, EXPRESSLY DISCLAIM
          ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS, STATUTORY, OR IMPLIED,
          INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, ACCURACY,
          QUALITY, AND NON-INFRINGEMENT.
        </Text>
      </Text>
      <Text>
        {'\t'}{' '}
        <Text>
          {' '}
          b. AMEELIO AND OTHER RELATED PARTIES MAKE NO WARRANTY THAT (I) OUR
          SERVICES WILL MEET YOUR REQUIREMENTS, (II) SERVICES ARE FREE OF
          INFECTION OR VIRUSES, WORMS, TROJAN HORSES, OR OTHER CODE THAT
          MANIFESTS CONTAMINATING OR DESTRUCTIVE PROPERTIES, (III) SERVICES WILL
          BE UNINTERRUPTED, TIMELY, OR SECURE (IV) ANY RESPONSIBILITY OR
          LIABILITY FOR THE ACCURACY, CONTENT, COMPLETENESS, OR LEGALITY OF
          INFORMATION AVAILABLE THROUGH THE SERVICES (V) THE QUALITY OF ANY
          PRODUCTS, SERVICES, SOFTWARE, INFORMATION, OR OTHER MATERIAL OBTAINED
          BY YOU THROUGH OUR SERVICES WILL MEET YOUR EXPECTATIONS, AND (VI) ANY
          ERRORS IN OUR SERVICES OR SOFTWARE WILL BE CORRECTED.
        </Text>
      </Text>
      <Text>
        {'\t'}{' '}
        <Text>
          {' '}
          c. ANY MATERIAL DOWNLOADED, UPLOADED, OR OTHERWISE OBTAINED THROUGH
          THE USE OF OUR WEBSITE OR SOFTWARE IS DONE AT YOUR OWN RISK AND YOU
          WILL BE SOLELY RESPONSIBLE FOR ANY DAMAGE TO YOUR COMPUTER SYSTEM OR
          BUSINESS OR DATA LOSS THAT RESULTS FROM THE DOWNLOAD OR UPLOAD OF ANY
          SUCH MATERIAL OR THE USE OF OUR WEBSITE OR SOFTWARE.
        </Text>
      </Text>
      <Text>
        {'\t'}{' '}
        <Text>
          {' '}
          d. NO ADVICE OR INFORMATION FROM AMEELIO SHALL CREATE ANY WARRANTY.
          ADVICE OR INFORMATION RECEIVED BY MEANS OF OUR WEBSITE SHOULD NOT BE
          RELIED UPON FOR SIGNIFICANT PERSONAL, LEGAL, BUSINESS, MEDICAL, OR
          FINANCIAL DECISIONS. YOU SHOULD CONSULT AN APPROPRIATE PROFESSIONAL
          FOR ADVICE TAILORED TO YOUR SPECIFIC SITUATION.
        </Text>
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'}{' '}
        <Text>
          {' '}
          e. BECAUSE SOME STATES DO NOT PERMIT THE DISCLAIMER OF CERTAIN
          WARRANTIES, YOU MAY HAVE ADDITIONAL RIGHTS UNDER YOUR LOCAL LAWS.
        </Text>
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'} 11.{' '}
        <Text style={Typography.FONT_SEMIBOLD}>Limitation of Liability. </Text>
        <Text>
          TO THE FULLEST EXTENT ALLOWED BY APPLICABLE LAW, IN NO EVENT SHALL
          AMEELIO, ITS AFFILIATES, OR ITS THIRD-PARTY SERVICE PROVIDERS BE
          LIABLE FOR ANY DIRECT, SPECIAL, INDIRECT, INCIDENTAL, EXEMPLARY,
          PUNITIVE, OR CONSEQUENTIAL DAMAGES, OR ANY OTHER DAMAGES OF ANY KIND,
          WHETHER IN AN ACTION IN CONTRACT, TORT (INCLUDING BUT NOT LIMITED TO
          NEGLIGENCE), OR OTHERWISE, ARISING OUT OF OR IN ANY WAY CONNECTED
          WITH:
        </Text>
      </Text>
      <Text>
        {'\t'}{' '}
        <Text>
          {' '}
          (i) THE USE OR INABILITY TO USE OUR SERVICES ON OR THROUGH OUR
          WEBSITE;
        </Text>
      </Text>
      <Text>
        {'\t'}{' '}
        <Text>
          {' '}
          (ii) ANY CLAIM FOR DAMAGES OF LOST PROFITS, LOSS OF USE, LOSS OF
          GOODWILL, LOSS OF DATA, WORK STOPPAGE, ACCURACY OF RESULTS, OR
          COMPUTER FAILURE OR MALFUNCTION;
        </Text>
      </Text>
      <Text>
        {'\t'}{' '}
        <Text>
          {' '}
          (iii) ANY CLAIM ATTRIBUTABLE TO ERRORS, OMISSIONS, OR INACCURACIES IN
          OUR SERVICES OR THE CONTENT, MATERIALS, SOFTWARE, INFORMATION,
          PRODUCTS, OR SERVICES ON OR AVAILABLE ON OUR WEBSITE;
        </Text>
      </Text>
      <Text>
        {'\t'}{' '}
        <Text>
          {' '}
          (iv) THE COST OF PROCUREMENT OF SUBSTITUTE GOODS AND SERVICES
          RESULTING FROM ANY PRODUCTS, DATA, OR INFORMATION OBTAINED THROUGH OR
          FROM OUR WEBSITE OR SERVICES;
        </Text>
      </Text>
      <Text>
        {'\t'}{' '}
        <Text>
          {' '}
          (v) UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR TRANSMISSIONS OR
          DATA;
        </Text>
      </Text>
      <Text>
        {'\t'}{' '}
        <Text>
          {' '}
          (vi) THE DELAY OR FAILURE IN PERFORMANCE RESULTING FROM AN ACT OF
          FORCE MAJEURE, INCLUDING WITHOUT LIMITATION, ACTS OF GOD, NATURAL
          DISASTERS, COMMUNICATIONS FAILURES, GOVERNMENTAL ACTIONS, WARS, RIOTS,
          LABOR DISPUTES, STRIKES OR ANY REASONS BEYOND REASONABLE CONTROL; OR
        </Text>
      </Text>
      <Text>
        {'\t'}{' '}
        <Text>
          {' '}
          (vii) ANY OTHER MATERIAL RELATING TO OUR WEBSITE, EVEN IF AMEELIO OR
          ITS AFFILIATES HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES,
          YOUR SOLE REMEDY FOR DISSATISFACTION WITH OUR WEBSITE AND SERVICES IS
          TO STOP USING OUR WEBSITE AND THOSE SERVICES.
        </Text>
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'}{' '}
        <Text>
          {' '}
          (vii) ANY OTHER MATERIAL RELATING TO OUR WEBSITE, EVEN IF AMEELIO OR
          ITS AFFILIATES HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES,
          YOUR SOLE REMEDY FOR DISSATISFACTION WITH OUR WEBSITE AND SERVICES IS
          TO STOP USING OUR WEBSITE AND THOSE SERVICES.
        </Text>
      </Text>
      <Text style={Styles.bottomPadding}>
        <Text>
          {' '}
          IN NO EVENT SHALL AMEELIO BE LIABLE TO YOU OR ANY OTHER PERSON FOR ANY
          AMOUNT IN THE AGGREGATE IN EXCESS OF THE GREATER OF THE AMOUNTS PAID
          BY YOU TO THE COMPANY IN CONNECTION IN THE SERVICES IN THE TWELVE (12)
          MONTH PERIOD PRECEDING THIS APPLICABLE CLAIM OR ANY MATTER BEYOND OUR
          REASONABLE CONTROL.
        </Text>
      </Text>
      <Text style={Styles.bottomPadding}>
        <Text>
          {' '}
          Some states do not allow the exclusion or limitation of liability for
          certain damages. In such jurisdictions, the liability of Ameelio shall
          be limited to the maximum extent permitted by law.
        </Text>
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'} 12.{' '}
        <Text style={Typography.FONT_SEMIBOLD}>Indemnification. </Text>
        <Text>
          To the fullest extent allowed by applicable law, you agree to
          indemnify and hold harmless Ameelio, and its officers, agents,
          assigns, licensors, and employees from and against all loses,
          expenses, costs, and damages, including legal and accounting fees
          arising from or in any way related to third party claims related to
          the use of or your connection to our website, our products and
          Services, your violation of these Terms, or your violation of any law
          or the rights of another. These obligations will survive any
          termination of your relationship with Ameelio or your use of our
          Services.
        </Text>
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'} 13.{' '}
        <Text style={Typography.FONT_SEMIBOLD}>
          No Privileged Conversations.{' '}
        </Text>
        <Text>
          When you use Ameelio’s services, you acknowledge and agree Connect
          Sessions on Ameelio will be recorded and may be monitored. Recordings
          are not deleted. Please note that the rules and procedures concerning
          privatization may vary by jurisdiction, Department of Correction
          regulations, and the particular equipment and procedures applicable at
          each correctional facility. You agree and you waive any and all claims
          against Ameelio arising from the recording of Connect Sessions.
        </Text>
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'} 14. <Text style={Typography.FONT_SEMIBOLD}>Assignment. </Text>
        <Text>
          You may not assign or transfer these Terms, by operation of law or
          otherwise. Any attempt by you to assign or transfer these Terms
          without such consent will be of no effect. Ameelio may assign or
          transfer these Terms, at is sole discretion, without restriction.
        </Text>
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'} 15. <Text style={Typography.FONT_SEMIBOLD}>No Waiver. </Text>
        <Text>
          The failure of Ameelio to enforce any provision or right in these
          Terms will not constitute a waiver of future enforcement of that
          provision or right.
        </Text>
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'} 16. <Text style={Typography.FONT_SEMIBOLD}>Severability. </Text>
        <Text>
          If for any reason a court of competent jurisdiction or arbitrator
          finds any provision of these Terms invalid or unenforceable, that
          provision will be enforced to the maximum extent permissible. The
          other provisions of these Terms will remain in full force and effect.
        </Text>
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'} 17. <Text style={Typography.FONT_SEMIBOLD}>Arbitration. </Text>
        <Text>
          Given the high cost of legal disputes, both you and Ameelio agree that
          any legal dispute concerning or arising in any way from these Terms or
          any Ameelio product or Service shall be resolved through binding
          arbitration.
        </Text>
      </Text>
      <Text style={Styles.bottomPadding}>
        Prior to arbitration, either party asserting a dispute shall first try
        in good faith to resolve it by providing written notice describing the
        facts and circumstances, including any relevant documentation.
      </Text>
      <Text style={Styles.bottomPadding}>
        Any controversy or claim arising out of or relating to these Terms, or
        the breach of these Terms, shall be settled by arbitration administered
        by the American Arbitration Association in accordance with its
        Commercial Arbitration Rules. Judgment on the award rendered by the
        arbitrator(s) may be entered in any court having jurisdiction.
      </Text>
      <Text style={Styles.bottomPadding}>
        YOU UNDERSTAND AND AGREE THAT BY ENTERING INTO THESE TERMS, YOU AND
        AMEELIO ARE EACH WAIVING THE RIGHT TO TRIAL BY JURY.
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'} 18. <Text style={Typography.FONT_SEMIBOLD}>Governing Law. </Text>
        <Text>
          These Terms (and any further rules, policies, or guidelines
          incorporated by reference) shall be governed and construed in
          accordance with the laws of the State of Connecticut. Any action based
          on, relating to, or alleging breach of the Terms must be brought
          through arbitration, as explained above, using Connecticut law. Both
          parties agree to submit to the exclusive personal jurisdiction and
          venue of such courts.
        </Text>
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'} 19.{' '}
        <Text style={Typography.FONT_SEMIBOLD}>Entire Agreement. </Text>
        <Text>
          These Terms constitute the entire agreement between you and Ameelio
          regarding your use of the Services and supersede all prior agreements
          and understandings.
        </Text>
      </Text>
      <Text style={Styles.bottomPadding}>
        {'\t'} 20. <Text style={Typography.FONT_SEMIBOLD}>Contact Us. </Text>
        <Text style={Styles.bottomPadding}>
          If you have any questions about the Terms of Service, please do not
          hesitate to contact us at{' '}
          <Text
            style={{ color: Colors.AMEELIO_BLUE }}
            onPress={() => Linking.openURL('mailto:team@ameelio.org')}
          >
            team@ameelio.org{' '}
          </Text>
          .
        </Text>
      </Text>
    </ScrollView>
  );
};

export default TermsScreen;
