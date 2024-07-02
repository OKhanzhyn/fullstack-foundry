import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import css from './AddWaterBtn.module.css';
import Icon from '../Icon/Icon';
import WaterModal from '../WaterModal/WaterModal';
import BasicModal from '../BasicModal/BasicModal';
import { useDispatch } from 'react-redux';
import { addWater } from '../../redux/water/operations';

const AddWaterBtn = ({ isBig = true, selectedDate }) => {
  const [modIsOpen, setModIsOpen] = useState(false);
  const [initialData, setInitialData] = useState({ amount: 50, time: '' });

  const dispatch = useDispatch();

  useEffect(() => {
    if (modIsOpen) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.post('https://aquatrack-api-myzh.onrender.com/api/water/day', { date: new Date().toISOString().split('T')[0] }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('Data on server before opening modal:', response.data);
        } catch (error) {
          console.error('Error fetching water items:', error);
        }
      };
      fetchData();

      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${hours}:${minutes}`;
      setInitialData({ amount: 50, time: currentTime });
    }
  }, [modIsOpen]);

  const closeWaterModal = useCallback(() => {
    setModIsOpen(false);
    // fetchDailyActivity();
  }, []);

  const handleSubmit = async (data) => {
    try {
      const date = new Date(selectedDate);
      const [hours, minutes] = data.time ? data.time.split(':') : [date.getHours(), date.getMinutes()];
      date.setHours(hours);
      date.setMinutes(minutes);

      await dispatch(addWater(data));
      closeWaterModal();
    } catch (error) {
      console.error('Error submitting data:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <>
      <div className={css.addBtnWrap}>
        <button
          className={isBig ? css.btnBig : css.btnSmall}
          type="button"
          onClick={() => setModIsOpen(true)}
        >
          {isBig ? (
            <Icon
              iconName="plus"
              width="18"
              height="18"
              styles={css.iconWhite}
            />
          ) : (
            <div className={css.iconWrapper}>
              <Icon
                iconName="plus"
                width="18"
                height="18"
                styles={css.iconGrey}
              />
            </div>
          )}
          <span className={isBig ? css.txtSmall : css.txtBig}>Add water</span>
        </button>
      </div>
      <BasicModal isOpen={modIsOpen} onClose={closeWaterModal}>
        <WaterModal
          isOpen={modIsOpen}
          onClose={closeWaterModal}
          onSubmit={handleSubmit}
          type="add"
          initialData={initialData}
        />
      </BasicModal>
    </>
  );
};

export default AddWaterBtn;
