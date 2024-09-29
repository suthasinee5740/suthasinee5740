function handler(input) {
    let validateData = {};
    validateData.validateCustomerPriceGroup = validateMessage(
      input.customer[0].PriceGroup.length,
      'กลุ่มลูกค้า'
    );
    validateData.validateCustomergroupG = validateMessage(
        input.customer[0].groupG.length,
        'Group G'
      );
  
    return validateData;
  }
  function validateMessage(input, module) {
    let message;
    if (input == 0) {
      message = `ไม่มีข้อมูล ${module} กรุณาติดต่อ Help Desk Weplus `;
      return `<font color=red>${message}</font>`;
    }
  }
  