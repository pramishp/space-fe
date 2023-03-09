(function() {
 const messages = JSON.parse("{\"BFQbdQ\":\"We hope you're enjoying {0}! We'll be sending important billing emails to <strong>{1}</strong>. If this isn't correct, please <alert-link data-id=\\\"canva_pro_email_confirmation_link\\\">update your email</alert-link>.\",\"Vv+gIg\":\"Password successfully updated\",\"WjJFhw\":\"Enjoy more advanced and team management features on {0} with CNY 35/month for the first 5 members. <alert-link data-id=\\\"canva_teams_cn_migration_link\\\">View Details</alert-link>.\",\"pcNNnw\":\"From July 18, 2022, we’re updating our Privacy Policy to provide more clarity about how we protect and use your data. <alert-link data-id=\\\"update_in_terms_and_conditions_2022_link\\\">Learn more about these changes</alert-link>.\",\"hYU9Cg\":\"Your {0} plan has expired. To continue using your most-loved features, <Anchor>renew {0}.</Anchor>\",\"/J0ZBw\":\"Please update your password\",\"+2oGyA\":\"We need you to confirm your ZIP code for tax purposes. <alert-link data-id=\\\"update_billing_address_dialog\\\">Update Zip code</alert-link>\",\"o8/8yw\":\"参与Canva产品问卷调查，赢取百元京东E卡！<alert-link data-id=\\\"canva_for_business_survey_link\\\">参与调查</alert-link>\",\"R9hSsg\":\"As of {0, date, long}, the price of having 6 or more team members on your Canva subscription will be as per our <Anchor>new pricing</Anchor>. But don’t worry, the price of your current ’5 for 1’ offer hasn’t changed for your first 5 team members.\",\"V0BHjQ\":\"On April 13, 2023, your organization will be enforcing SSO on your account. If you’re a <strong>teacher or staff member</strong> (students should disregard), make sure you <alert-link data-id=\\\"nsw_education_change_email_link\\\">change your email address</alert-link> to your @det.nsw.edu.au email address to maintain access to your designs in Canva. <alert-link data-id=\\\"nsw_education_maintain_sso_access\\\">Learn more.</alert-link>\",\"SeEnhQ\":\"This account was found to be violating our Terms of Use and has been downgraded to Canva Free. <alert-link data-id=\\\"fraudulent_brand_notice_dialog\\\">Switch to your personal account and upgrade now.</alert-link>\",\"/XO/zg\":\"Will you create the 15 billionth design?\",\"3fYY3Q\":\"Important: We’ve improved the payout process. All Creators must <alert-link data-id=\\\"update_payout_profile_link\\\"><strong>update their preferences</strong></alert-link>.\",\"NNqzww\":\"We’ve updated our security procedures.\",\"MIigqA\":\"Your payment method is missing information required for tax purposes. <alert-link data-id=\\\"update_billing_address_dialog\\\">Update your billing address</alert-link>\",\"Shsz4Q\":\"Your request to join {0} is waiting to be approved by an admin.\",\"Q7KHaQ\":\"From July 18, 2022, we’re introducing Canva for Teams, our new paid plan. We’re also updating our Terms of Use and Privacy Policy. <alert-link data-id=\\\"update_in_terms_and_conditions_2022_link\\\">Learn more about these changes</alert-link>.\",\"prlAUA\":\"We've made changes to our pricing. Your team is now getting {0} for less. <alert-link data-id=\\\"teams_price_reduction_link\\\">Manage your team</alert-link>.\",\"IrkK6A\":\"We'll send you alerts to help you design better. Click <alert-link data-id=\\\"push_notification_subscribe\\\">here</alert-link> to allow notifications.\",\"v+HNFA\":\"You have {0} days remaining on your {1} plan. To secure your spot, <strong><alert-link data-id=\\\"flexible_billing_pay_by_link\\\">pay your invoice.</alert-link></strong>\",\"TLX9Tg\":\"Your {0} plan is expiring today. To continue using your most-loved features, please remind your administrator to renew.\",\"VZbscw\":\"We're sorry, an error occurred while performing this action. Please check your internet connection and try again later\",\"xgjVjA\":\"Thanks, your email address is now confirmed!\",\"AZP8rw\":\"Due to recent regulatory changes, you’re now on a {0} prepaid plan which will expire on {1, date, long}. To continue using {0}, <alert-link data-id=\\\"renew_subscription_dialog\\\">renew your plan now.</alert-link>\",\"VVBBNg\":\"Your request to join {0} has been denied. Talk to an administrator at your school for more information.\",\"zmitXQ\":\"Existing password\",\"t9qxEg\":\"Our Support and Operations are still running to meet your needs, but print orders will experience delays in your market until {0} to ensure the safety of our manufacturing locations. Stay safe and <alert-link data-id=\\\"covid19_print_delay_tips_page\\\">click here</alert-link> for more tips.\",\"zYVQQw\":\"New password\",\"Ft0vjw\":\"Your {1} prepaid plan is expiring in <SemiBold>{0, plural, =0 {# day} one {# day} other {# days}}</SemiBold>. To avoid losing your access to your most-loved features, please remind your administrator to renew.\",\"a6BqMw\":\"Dismiss\",\"ldfj2A\":\"Important: We are discontinuing Skrill, please <alert-link data-id=\\\"replace_payout_skrill_link\\\"><strong>select a new payout preference</strong></alert-link>.\",\"c2+6VQ\":\"To keep your account secure, we recommend that you reset your password.\",\"iFp4yg\":\"You have been switched to {0}. Here you can enjoy more advanced and team management features with CNY 35/month for the first 5 members. Discounted pricing is available for teams of six or more. The new pricing will be applied from the next billing cycle. <alert-link data-id=\\\"canva_teams_cn_migration_link\\\">View Details</alert-link>.\",\"LCMsPQ\":\"Confirm new password\",\"BT7bKA\":\"<alert-link data-id=\\\"canva_for_business_promo_link\\\">11.11 limited time offer! Buy one year of Canva For Business and get a second year free!</alert-link>\",\"6YIoPw\":\"Your team administrators have made some changes so that if a member leaves {0}, you won't lose access to their content. In a few days, administrators will be able to transfer the designs of a departing member to an existing one. <alert-link data-id=\\\"content_transfer_terms_link\\\">Learn more</alert-link>\",\"4wBjOg\":\"Enter your existing password\",\"jG8GuA\":\"Your {0} plan has expired. To continue using your most-loved features, please remind your administrator to renew.\",\"hXLDFw\":\"We've made changes to our <alert-link data-id='content_transfer_terms_link'>Terms of Use</alert-link> around how Enterprise Teams can manage designs.\",\"hJ1KSA\":\"The password you entered is incorrect\",\"SVsKlg\":\"We hope you're enjoying {0}! You have <strong>{1, plural, one {# day} other {# days}} left in your trial.</strong> After this, you'll be billed {2}. <alert-link data-id=\\\"update_billing_preferences_link\\\">Change settings</alert-link>\",\"HTyqrQ\":\"Enjoy more advanced and team management features on {0} with CNY 350/year for the first 5 members. If you want to keep designing on your own, the current plan and pricing can be kept permanently. If you want to add members, please <alert-link data-id=\\\"canva_teams_cn_migration_link\\\">contact support</alert-link>.\",\"6zjx2g\":\"Important: We’ve improved the payout process. Please <alert-link data-id=\\\"replace_payout_paypal_link\\\"><strong>re-register your PayPal account</strong></alert-link>.\",\"WsWhXA\":\"You've signed up with email address <strong>{0}</strong>. Please confirm your email address <alert-link data-id=\\\"email_confirmation_link\\\">here</alert-link>, or <alert-link data-id=\\\"email_update_link\\\">update your email</alert-link>.\",\"PmpTPg\":\"As of {0, date, long}, the price of having 6 or more team members on your Canva subscription will be as per our <Anchor>new pricing</Anchor>. But don’t worry, the price of your current ‘5 for 1’ offer hasn’t changed, and you can still add up to 4 additional team members at no extra cost.\",\"M6dEKw\":\"Reset password\",\"cmZeGQ\":\"Your team administrators have made some changes so that if a member leaves {0}, you won't lose access to their content. From {1, date, medium}, administrators will be able to transfer the designs of a departing member to an existing one. <alert-link data-id=\\\"content_transfer_terms_link\\\">Learn more</alert-link>\",\"qJjWsw\":\"Your {0} plan is expiring today. To continue using your most-loved features, <Anchor>renew {0}.</Anchor>\",\"RQFTgg\":\"Our Support and Operations are still running to meet your needs, but print orders will experience delays in your market to ensure the safety of our manufacturing locations. Stay safe and <alert-link data-id=\\\"covid19_print_delay_tips_page\\\">click here</alert-link> for more tips.\",\"x/ixhg\":\"We couldn't open that page. There was a problem on our end. Please try again later.\",\"Ot0UuQ\":\"Your {1} prepaid plan is expiring in <SemiBold>{0, plural, =0 {# day} one {# day} other {# days}}</SemiBold>. To avoid losing your access to your most-loved features, <Anchor>renew {1}.</Anchor>\",\"ozeQ4Q\":\"Your request to join {0} has been approved! <alert-link data-id='join_school_request_approved_link'>Click here to go to your school</alert-link>.\",\"K5N6yQ\":\"Enter new password\",\"82v6/Q\":\"Confirm new password\",\"vvBgeg\":\"<strong>Password update required:</strong> For security reasons, you’re required to <alert-link data-id=\\\"account_settings_password\\\">update your password</alert-link>.\",\"Gey9Ww\":\"<strong>Consider updating your browser.</strong> Canva no longer supports the current version of your browser. From {0, date, monthYear}, you'll no longer be able to use or access Canva from this version. <a href=\\\"/help/article/technical-requirements\\\" target=\\\"_blank\\\" rel=\\\"noopener\\\">Find out more.</a>\",\"4zmu0g\":\"This version of the Canva app is no longer supported. To ensure best experience, please update to the latest version from <alert-link data-id=\\\"desktop_app_download_link\\\">here</alert-link>.\"}");
 const cmsg = window["cmsg"] = window["cmsg"] || {};
 const strings = cmsg["strings"] = cmsg["strings"] || {};
 strings["en"] = strings["en"] ? Object.assign(strings["en"], messages) : messages;
})();