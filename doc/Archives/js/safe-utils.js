// Small safety utilities
(function(){
  function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, function(c){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c];
    });
  }

  // Expose globally for existing non-module code
  window.escapeHtml = escapeHtml;
})();
