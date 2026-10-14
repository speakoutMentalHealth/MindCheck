/* Leadership Summit certificate downloads are paused.
 * The previous implementation is preserved in Git history for authorized future
 * redevelopment; never restore browser-side bulk attendee downloads or SheetDB
 * access without server-side authorization and privacy review.
 */
'use strict';
function verifyUser(){
  const message=document.getElementById('message');
  if(message)message.textContent='Certificate verification is temporarily unavailable.';
  return false;
}
